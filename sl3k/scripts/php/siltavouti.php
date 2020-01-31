<?php
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json; charset=utf-8');
  echo file_get_contents('https://www.amica.fi/modules/json/json/Index?costNumber=0321&language=fi');
?>