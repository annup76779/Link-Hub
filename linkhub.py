from flask import Flask, render_template, request, redirect, url_for, flash, make_response 
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.secret_key = '\x18\xf4\xdf\r\xfd\xbb\xa1%\xe5\xa7\xf8\xad\x85:\xc6U'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///link-hub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)# initalization of database


class Links(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    topic = db.Column(db.String, nullable = False)
    url = db.Column(db.String, nullable = False)
    title = db.Column(db.String, nullable = False)


    def __repr__(self):
        return f"<Topic:'{self.topic}', Title:'{self.title}', URL:'{self.url}'>"


# uncomment the line below 
db.create_all() 


@app.route('/')
@app.route("/<topics>")
def linkhub(topics=None):
    if topics:
        title = f"Link Hub|{topics}"
        types = Links.query.with_entities(Links.topic).distinct().all()
        links = Links.query.with_entities(Links.url,Links.id,Links.title).filter_by(topic = topics).all()
        resp = make_response(render_template("link-hub.html", title=title, type=topics, types=types, links=links))
        resp.set_cookie("topic",value = str(topics))
        return resp
    else:
        title = "Link Hub"
        types = Links.query.with_entities(Links.topic).distinct().all()
        return render_template("link-hub.html", title = title, types=types)


@app.route("/add-link", methods = ["POST"])
def add_link():
    if request.method == "POST":
        try:
            url_topic = request.form.get("topic", "")
            url_title = request.form.get("title", "")
            url = request.form.get("url", "")
            if url != "" and url_topic != "" and url_title != "":
                inputs = Links(topic = url_topic, url = url, title = url_title)
                print(inputs)
                db.session.add(inputs)
                db.session.commit()
                flash("Link added successfully!", "success")
                topic = request.cookies.get("topic", None)
            else:
                flash("Empty insetrtion encountered!", "error")
            if topic:
                return redirect(f"/{topic}")
            else:
                return redirect("/")
        except Exception:
            flash("Error orrcued!", "error")
            topic = request.cookies.get("topic", None)
            if topic:
                return redirect(f"/{topic}")
            else:
                return redirect("/")
    else:
        topic = request.cookies.get("topic", "")
        if topic != "":
            return redirect(f"/{topic}")
        else:
            return redirect("/")


@app.route("/delete")
def delete():
    if request.args.get("del"):
        try:
            key_id = int(request.args.get("del",""))
            Links.query.filter_by(id = key_id).delete()
            db.session.commit()
            flash("Link deleted!","info")
        except Exception:
            flash("Error occured!", "error")
        topic = request.cookies.get("topic", None)
        if topic:
            return redirect(f"/{topic}")
        else:
            return redirect("/")
    else:
        flash("Error occured!", "error")
        topic = request.cookies.get("topic", None)
        if topic:
            return redirect(f"/{topic}")
        else:
            return redirect("/")


@app.route("/search", methods=["GET"])
def search():
    if request.args.get("search"):
        key = request.args.get("search")
        feeds = Links.query.with_entities(Links.url,Links.id,Links.title).filter(Links.title.like(f'%{key}%')|Links.topic.like(f'%{key}%')|Links.url.like(f'%{key}%')).all()
        types = Links.query.with_entities(Links.topic).distinct().all()
        return render_template("link-hub.html", title=f"Link Hub|{key}", type=key, types=types, links=feeds)


if __name__ == "__main__":
    app.run(debug = True)
