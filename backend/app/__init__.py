import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from .routes import auth_bp, empresas_bp, servicos_bp, orcamentos_bp, financeiro_bp


def create_app():
    # Resolve frontend dist path
    frontend_dist = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "frontend",
        "dist",
    )

    app = Flask(__name__, static_folder=frontend_dist, static_url_path="")
    CORS(app)

    # Register API blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(empresas_bp)
    app.register_blueprint(servicos_bp)
    app.register_blueprint(orcamentos_bp)
    app.register_blueprint(financeiro_bp)

    # Serve React app for all non-API routes
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        # If the file exists in dist, serve it (JS, CSS, images, etc.)
        file_path = os.path.join(frontend_dist, path)
        if path and os.path.isfile(file_path):
            return send_from_directory(frontend_dist, path)
        # Otherwise serve index.html (SPA routing)
        return send_from_directory(frontend_dist, "index.html")

    return app
