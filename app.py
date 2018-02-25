"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/

This file creates your application.
"""

import os
from flask import Flask, render_template, request, redirect, url_for, jsonify
from authentication import Firebase

app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'this_should_be_configured')


###
# Routing for your application.
###

@app.route('/')
def home():
    """Render website's home page."""
    return render_template('home.html')


@app.route('/update', methods=['POST'])
def my_test_endpoint():
    input_json = request.get_json(force=True)
    # force=True, above, is necessary if another developer
    # forgot to set the MIME type to 'application/json'
    lat = float(input_json['lat'])
    lng = float(input_json['lng'])
    userId = str(input_json['uuid'])
    print(lat)
    print(lng)
    print(userId)
    boop = Firebase()
    boop.addEntry(lat, lng, userId)
    return render_template('home.html')

@app.route('/updateIncident', methods=['POST'])
def my_update_endpoint():
    input_json = request.get_json(force=True)
    # force=True, above, is necessary if another developer
    # forgot to set the MIME type to 'application/json'
    lat = float(input_json['lat'])
    lng = float(input_json['lng'])
    userId = str(input_json['type'])
    boop = Firebase()
    boop.addIncident(lat, lng, userId)
    return render_template('home.html')

@app.route('/get/heatmap', methods=['POST'])
def my_incidentheatmap_endpoint():
    input_json = request.get_json(force=True)
    # force=True, above, is necessary if another developer
    # forgot to set the MIME type to 'application/json'
    lat = float(input_json['lat'])
    lng = float(input_json['lng'])
    boop = Firebase()
    result = boop.getCrazyHeat(lat,lng)
    return jsonify({"heatmap":result})


@app.route('/get/nearby', methods=['POST'])
def my_nearby_endpoint():
    input_json = request.get_json(force=True)
    # force=True, above, is necessary if another developer
    # forgot to set the MIME type to 'application/json'
    lat = float(input_json['lat'])
    lng = float(input_json['lng'])
    boop = Firebase()
    result = boop.getEveryonePoits((lat,lng))
    return jsonify({"nearby":result})

@app.route('/get/traffic', methods=['POST'])
def poopyPie():
    traffic = []
    input_json = request.get_json(force=True)
    for i in input_json:
        traffic.append(my_data(i))
    return jsonify({'traffic': traffic})

def my_data(input_json):
    base = Firebase()

    data = []
    for i in input_json:
        data.append((i["lat"], i["lng"]))
    #print(data)
    res = []
    for i in range(len(data)):
        #print(base.getTraffic(data[i]))
        if i%5 == 0:
            res.append(base.getTraffic(data[i]))
        if i%5 != 0 and i == len(data)-1:
            res.append(base.getTraffic((data[i])))
    total = sum(res)
    traffic = total/len(res)
    return traffic

@app.route('/get/incident', methods=['POST'])
def my_data_event():
    base = Firebase()
    input_json = request.get_json(force=True)
    data = []
    for i in input_json:
        data.append((i["lat"], i["lng"]))
    res = base.getIncidents(data[0])

    return jsonify({'incidents': res})


@app.route('/about/')
def about():
    """Render the website's about page."""
    return render_template('about.html')


###
# The functions below should be applicable to all Flask apps.
###

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=600'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True)



