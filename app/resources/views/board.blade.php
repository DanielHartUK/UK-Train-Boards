@extends('layouts.app')

@section('title', __('boards.'.$type))

@section('content')
  <Board
    type="{{$type}}"
    stn="{{$station}}"
  >
  </Board>
@endsection
