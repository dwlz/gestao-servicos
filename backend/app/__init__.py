import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from .routes import auth_bp, empresas_bp, servicos_bp, orcamentos_bp, financeiro_bp


def create_app():
    # Resolve frontend dist path (use abspath to handle relative __file__)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    frontend_dist = os.path.join(
        os.path.dirname(base_dir),
        "frontend",
        "dist",
    )
    print(f"📁 Frontend dist path: {frontend_dist}")
    print(f"📁 Exists: {os.path.isdir(frontend_dist)}")

    # Do NOT set static_folder — it conflicts with the SPA catch-all route
    app = Flask(__name__, static_folder=None)
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
        if path:
            file_path = os.path.join(frontend_dist, path)
            if os.path.isfile(file_path):
                return send_from_directory(frontend_dist, path)
        # Otherwise serve index.html (SPA client-side routing)
        return send_from_directory(frontend_dist, "index.html")

    # Safety net: any 404 on a non-API route also returns the React app
    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(frontend_dist, "index.html")

    return app
