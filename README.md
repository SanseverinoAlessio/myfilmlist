# Myfilmlist

Welcome to my project. Myfilmlist is a web application developed with angular, node js and mongodb(mongoose as a framework of mongodb).

## env variables

### Create an .env file, and add these variables

* origin = add the url of your client application
* mongodb = specify the mongodb url
* aws_storage = add this with true value if you want to use external storage. If you miss it, the code saves automatically in the public folder.
* aws_key = add your aws storage key if you want to use it
* aws_secret = your aws secret key
* bucket_name = your bucket name
* email = the email that you want to use for nodemailer
* email_Password = the email's password
* Key = this key is utilized for json web token

## Npm Scripts
* build = generate a build version of both(client and server)
* dev = generate a development version of the Server
* buildServ = genere a production version of the Server
* start = if you use a development mode, this command starts the server only(and you should start the client with ng serve command), instead if you use the production mode,
the server shows also the client's dist directory.
