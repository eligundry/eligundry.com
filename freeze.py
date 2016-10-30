"""Static site generator for eligundry.com"""

import os

from flask import Flask, render_template
from flask_flatpages import FlatPages
from flask_frozen import Freezer


# Extensions
freezer = Freezer()


# Custom exceptions
class SkipRoute(Exception):
    """Generic exception to be raised if a route should be skipped."""


def register_routes(app):
    """Factory method to register routes."""
    template_dir = 'templates'
    ignored_dirs = ('layouts', 'includes')

    for subdir, dirs, files in os.walk(template_dir + '/'):
        _, base_route = subdir.split(template_dir)

        if any([folder in base_route for folder in ignored_dirs]):
            continue

        for file_path in files:
            try:
                create_route(app, *format_route_values(base_route, file_path))
            except SkipRoute:
                continue

    # create_route(app, '/', 'index', 'index.html')


def format_route_values(directory, file_path):
    route_name, extension = os.path.splitext(file_path)

    if extension in ('.json', '.jade', '.ejs'):
        raise SkipRoute("Skipping this file.")

    if route_name != 'index':
        route_path = os.path.join(directory, route_name)
    else:
        route_path = directory

        if route_path:
            route_name = '_'.join([directory, route_name])

    tempate_path = os.path.join('templates', directory, file_path)

    return (route_path, route_name, tempate_path)


def create_route(app, path, name, template):
    """Register a single route to be rendered in the static site."""
    def route_function():
        return render_template(template)

    route_function.__name__ = name
    app.route(path, methods=['GET'])(route_function)


def create_app(settings):
    """App factory."""
    app = Flask(__name__)
    app.config.from_object('config')

    # Flask Frozen
    # https://pythonhosted.org/Frozen-Flask/
    freezer.init_app(app)

    # Register routes
    register_routes(app)

    return app


if __name__ == '__main__':
    app_ = create_app('config.py')
    freezer.freeze()
    import pdb; pdb.set_trace()
    app_.run(debug=True)
