<!doctype html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <title>{{ title }}</title>

        <!-- build:css styles/vendor.css -->
        <!-- bower:css -->
        <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
        <link rel="stylesheet" href="bower_components/lil-b/dist/css/b.css" />
        <link rel="stylesheet" href="bower_components/fontawesome/css/font-awesome.css" />
        <!-- endbower -->
        <!-- endbuild -->

        <!-- build:css styles/main.css -->
        <link rel="stylesheet" href="styles/main.css">
        <!-- endbuild -->

        <!-- build:js scripts/vendor/modernizr.js -->
        <script src="bower_components/modernizr/modernizr.js"></script>
        <!-- endbuild -->
    </head>
    <body>
        <!--[if lt IE 10]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div class="container">
            {% block content %}{% endblock %}
        </div>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X');ga('send','pageview');
        </script>

        {# TODO: Use if tag for production/development. Remove build tags? #}

        {% if settings.env === "production" %}
            {# jquery, modernizr, bootstrap #}
            <script src="scripts/plugins.js"></script>
            {# all in scripts #}
            <script src="scripts/main.js"></script>
        {% else %}
            {# modernizr gets included twice, but only loads once #}
            <!-- build:js scripts/plugins.js -->
            <!-- bower:js -->
            <script src="bower_components/jquery/dist/jquery.js"></script>
            <script src="bower_components/modernizr/modernizr.js"></script>
            <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
            <!-- endbower -->
            <!-- endbuild -->

            <!-- build:js scripts/main.js -->
            <script src="scripts/app.js"></script>
            <script src="scripts/stuff.js"></script>
            <!-- endbuild -->
        {% endif %}

</body>
</html>
