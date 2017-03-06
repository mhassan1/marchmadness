<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

 <head>

   <title>Hassan/Nuba March Madness 2016</title>

<link rel="stylesheet" type="text/css" href="/marchmadness/css/bootstrap.min.css" media="all" />

<link rel="stylesheet" type="text/css" href="/marchmadness/css/bootstrap-theme.min.css" media="all" />

<link rel="stylesheet" type="text/css" href="/marchmadness/css/theme.css" media="all" />

 </head>



 <body role="document">

<nav class="navbar navbar-custom navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="/marchmadness">Hassan/Nuba March Madness 2016</a>
        </div>

<?php if($this->session->userdata('username')) { ?>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><a href="bracket">My Bracket</a></li>
            <li><a href="dashboard">Standings</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><span class="navbar-text">Welcome, <?=$this->session->userdata('username')?>!</span></li>
            <li><a href="login">Logout</a></li>
          </ul>
        </div>

<?php } ?>

      </div>
</nav>

<div class="container-fluid">
