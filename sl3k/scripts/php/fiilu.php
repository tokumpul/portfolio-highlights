<?php
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json; charset=utf-8');
  echo file_get_contents('https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=3364&language=fi');
?>