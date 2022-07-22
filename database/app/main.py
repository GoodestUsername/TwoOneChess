from flask import Flask, render_template, request, g, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mysqldb import MySQL

import os


app = Flask(__name__)

app.debug = True
app.config['SECRET_KEY'] = 'password'
app.config['SQLALCHEMY'] = 'sqlite:///site.db'

db = SQLAlchemy(app)

CORS(app)

@app.route('/')
def hello_world():
    return 'Hello world';