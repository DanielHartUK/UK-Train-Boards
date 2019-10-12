<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- CSRF Token -->
<meta name="csrf-token" content="{{ csrf_token() }}">

<!-- Site name, description, etc -->
<title>{{ config('app.name', 'UKRSIB') }}</title>
<meta name="description" content="{{ config('app.name', 'UKRSIB') }}">

<!-- Icons @TODO -->
<link rel="icon" sizes="192x192" href="{{ asset('icon/icon.png') }}">
<link rel="apple-touch-icon" href="{{ asset('icon/touch.png') }}"> <!-- Apple Touch Icon -->
<link rel="mask-icon" href="{{ asset('icon/pinned.svg') }}" color="blue"> <!-- Safari Pinned Tab Icon -->

<!-- Scripts -->
<script src="{{ asset('js/app.js') }}" defer></script>
<script src="{{ asset('js/lang.js') }}"></script>

<!-- Styles -->
<link href="{{ asset('css/app.css') }}" rel="stylesheet">

<!-- Web App Meta -->
<meta name="application-name" content="{{ config('app.name', 'UKRSIB') }}">
<meta name="theme-color" content="#4285f4"> <!-- @TODO Update this -->

<!-- SEO -->
<meta name="google" content="nositelinkssearchbox">
