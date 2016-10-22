from flask import Flask
from flask_frozen import Freezer


# Extensions
freezer = Freezer()


def register_routes(app):
    """Factory method to register routes."""
    @app.route('/')


def create_app(settings):
    """App factory."""
    app = Flask(__name__)

    # Flask Frozen
    # https://pythonhosted.org/Frozen-Flask/
    freezer.init_app(app)

    # Register routes

    return app


if __name__ == '__main__':
    app_ = create_app(None)
    freezer.freeze()
