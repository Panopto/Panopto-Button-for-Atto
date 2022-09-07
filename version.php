<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto panoptobutton  version file.
 *
 * @package    atto_panoptobutton
 * @copyright  Panopto 2009 - 2016
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

// The current plugin version (Date: YYYYMMDDXX).
$plugin->version   = 2022090700;

// Requires this Moodle version
$plugin->requires  = 2014051200;

// Full name of the plugin (used for diagnostics).
$plugin->component = 'atto_panoptobutton';

// This is considered as ready for production sites.
$plugin->maturity  = MATURITY_STABLE;

// Dependencies.
$plugin->dependencies = array(
    'block_panopto' => ANY_VERSION
);
