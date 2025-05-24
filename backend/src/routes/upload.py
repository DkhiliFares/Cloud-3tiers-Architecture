import boto3
import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime

# Configuration pour AWS S3
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY', 'your_access_key')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY', 'your_secret_key')
AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME', 'modastyle-images')
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')

# Création du client S3
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

# Création du blueprint pour les routes d'upload
upload_bp = Blueprint('upload', __name__)

# Extensions autorisées pour les images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/api/upload/image', methods=['POST'])
def upload_image():
    # Vérifier si un fichier est présent dans la requête
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'Aucun fichier trouvé'}), 400
    
    file = request.files['file']
    
    # Vérifier si un fichier a été sélectionné
    if file.filename == '':
        return jsonify({'success': False, 'message': 'Aucun fichier sélectionné'}), 400
    
    # Vérifier si le fichier est une image autorisée
    if not allowed_file(file.filename):
        return jsonify({'success': False, 'message': 'Type de fichier non autorisé. Utilisez PNG, JPG, JPEG, GIF ou WEBP'}), 400
    
    # Générer un nom de fichier unique pour éviter les collisions
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
    
    # Définir le chemin du fichier dans le bucket S3
    file_path = f"products/{unique_filename}"
    
    try:
        # Uploader le fichier vers S3
        s3_client.upload_fileobj(
            file,
            AWS_BUCKET_NAME,
            file_path,
            ExtraArgs={
                'ContentType': file.content_type,
                'ACL': 'public-read'  # Rendre l'image accessible publiquement
            }
        )
        
        # Générer l'URL de l'image
        image_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_path}"
        
        return jsonify({
            'success': True,
            'message': 'Image uploadée avec succès',
            'image_url': image_url,
            'filename': unique_filename
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erreur lors de l\'upload: {str(e)}'}), 500

@upload_bp.route('/api/delete/image', methods=['DELETE'])
def delete_image():
    data = request.json
    
    if 'filename' not in data:
        return jsonify({'success': False, 'message': 'Nom de fichier manquant'}), 400
    
    filename = data['filename']
    file_path = f"products/{filename}"
    
    try:
        # Supprimer le fichier de S3
        s3_client.delete_object(
            Bucket=AWS_BUCKET_NAME,
            Key=file_path
        )
        
        return jsonify({
            'success': True,
            'message': 'Image supprimée avec succès'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erreur lors de la suppression: {str(e)}'}), 500

# Fonction pour initialiser le blueprint
def init_app(app):
    app.register_blueprint(upload_bp)
