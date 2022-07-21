from flask import Flask, render_template, request, g
from flask_cors import CORS
from flask_mysqldb import MySQL

import os

import db
app = Flask(__name__)

app.debug = True

CORS(app)

@app.route('/')
def hello_world():
    return 'Hello world';