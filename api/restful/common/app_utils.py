from flask import Flask, Blueprint


def register_blueprint(app: Flask, blueprint: Blueprint, url_prefix):
    handle_exception = app.handle_exception
    handle_user_exception = app.handle_user_exception

    app.register_blueprint(blueprint, url_prefix=url_prefix)

    app.handle_exception = handle_exception
    app.handle_user_exception = handle_user_exception
