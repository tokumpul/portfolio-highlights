<?php
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json; charset=utf-8');
  $date = date('Y-m-d', time());
  echo file_get_contents('https://www.sodexo.fi/ruokalistat/output/daily_json/127/'.$date);
?>