<?php $this->load->view('header'); ?>

<div class="page-header"><h3>Login</h3></div>



   <p>Welcome to March Madness! Enter your unique username and password below!</p>

   <span style="color:red;"><?php echo validation_errors(); ?></span>

   <?php echo form_open('login/verifylogin'); ?>

     <table><tr>

     <td style="width:100px;">Username:</td>

     <td><input type="text" size="20" id="username" name="username"/></td>

     </tr><tr>

     <td>Password:</td>

     <td><input type="password" size="20" id="password" name="password"/></td>

     </tr>

     </table>

     <input type="submit" value="Login"/>

   </form>

 </body>

</html>
