"""Static site generator for eligundry.com"""

import os

from flask import Flask, render_template
from flask_flatpages import FlatPages
from flask_frozen import Freezer


# Extensions
freezer = Freezer()


def register_routes(app):
    """Factory method to register routes."""
    # template_dir = 'templates/'
    #
    # for subdir, dirs, files in os.walk(template_dir):
    #     base_route = subdir.split(template_dir)
    #
    #     if any((folder in base_route for folder in ('layouts', 'includes'))):
    #         continue
    #     elif base_route[0] in template_dir:
    #         base_route[0] = ''
    #
    #     @app.route(route_name, methods='GET')
    #     def index():
    #         return "hay"

    @app.route('/')
    def index():
        return render_template('index.html')


def create_app(settings):
    """App factory."""
    app = Flask(__name__)
    app.config.from_object('config')

    # Flask Frozen
    # https://pythonhosted.org/Frozen-Flask/
    freezer.init_app(app)

    register_routes(app)

    # Register routes
    return app


if __name__ == '__main__':
    app_ = create_app('config.py')
    freezer.freeze()
    app_.run(debug=True)
