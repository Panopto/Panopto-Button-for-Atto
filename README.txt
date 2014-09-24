Installation instructions:
-Navigate to /lib/editor/atto/plugins in the moodle directory and paste the plugin folder here.
-Navigate to the moodle server homepage in a browser while logged in as an administrator and follow the directions to install.
-After installation is completed, visit Site Administration > Plugins > Text Editors > Atto Toolbar Settings and confirm that 
'PanoptoButton' has been added to the list of installed plugins for Atto.
-On this same page, add 'panoptobutton' to the list of buttons following the heading 'style1' (it should now read 'style1 = title, bold, italic, widget, panoptobutton')
and save changes.
-Under the 'Site Administration' tab on the left side of the screen, navigate to Security -> Site Policies and check the box next to 'Enable Trusted Content'. By default, trusted content 
(e.g. Panopto Videos) will be able to be posted by those assigned the role Manager or Course Creator. Trusted roles may be added under Site Administration -> Permissions -> Users -> Define Roles. 
By selecting a role and enabling or disabling 'Enable Trusted Content' for that role.
-Next navigate to Site Administration -> Users -> Permissions -> Define Roles and assign whichever users should be able to post Panopto videos one of the roles in which posting trusted content is
enabled.
-The Panopto button for Atto should now be installed and functional on the MOodle server.