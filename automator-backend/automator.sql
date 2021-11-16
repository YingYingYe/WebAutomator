/*
SQLyog Community v13.1.6 (64 bit)
MySQL - 8.0.21 : Database - automator
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`automator` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `automator`;

/*Table structure for table `saveartefactlist` */

DROP TABLE IF EXISTS `saveartefactlist`;

CREATE TABLE `saveartefactlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `keyword` varchar(200) NOT NULL DEFAULT '',
  `startdate` varchar(200) NOT NULL DEFAULT '',
  `enddate` varchar(200) NOT NULL DEFAULT '',
  `article` text NOT NULL,
  `pictures` text NOT NULL,
  `saveaction` varchar(100) NOT NULL DEFAULT '',
  `cridbid` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `saveartefactlist` */

/*Table structure for table `savepersonlist` */

DROP TABLE IF EXISTS `savepersonlist`;

CREATE TABLE `savepersonlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `keyword` varchar(100) NOT NULL DEFAULT '',
  `birthplace` varchar(200) NOT NULL DEFAULT '',
  `deathplace` varchar(200) NOT NULL DEFAULT '',
  `birthdate` varchar(100) NOT NULL DEFAULT '',
  `deathdate` varchar(100) NOT NULL DEFAULT '',
  `article` text NOT NULL,
  `pictures` text NOT NULL,
  `saveaction` varchar(100) NOT NULL DEFAULT '',
  `cridbid` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `savepersonlist` */

/*Table structure for table `saveplacelist` */

DROP TABLE IF EXISTS `saveplacelist`;

CREATE TABLE `saveplacelist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `keyword` varchar(200) NOT NULL DEFAULT '',
  `latitude` varchar(200) NOT NULL DEFAULT '',
  `longitude` varchar(200) NOT NULL DEFAULT '',
  `article` text NOT NULL,
  `pictures` text NOT NULL,
  `saveaction` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `cridbid` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

/*Data for the table `saveplacelist` */

insert  into `saveplacelist`(`id`,`keyword`,`latitude`,`longitude`,`article`,`pictures`,`saveaction`,`cridbid`) values 
(12,'Etna, California','122° 53′ 49″ W','41° 27′ 26″ N','Etna is a city in the Scott Valley area of Siskiyou County, California, United States. The population was 737 at the 2010 census, down from 781 at the 2000 census.','https://upload.wikimedia.org/wikipedia/commons/9/9c/Odo_bayeux_tapestry.png\nhttps://upload.wikimedia.org/wikipedia/commons/5/5a/Odo_of_Bayeux.jpg\nhttps://upload.wikimedia.org/wikipedia/commons/d/d3/MontfauconHaroldEye.jpg\n','create',''),
(13,'Etna, California','122° 53′ 45″ W','41° 27′ 36″ N','Etna is a city in the Scott Valle','https://upload.wikimedia.org/wikipedia/commons/9/9c/Odo_bayeux_tapestry.png\nhttps://upload.wikimedia.org/wikipedia/commons/d/d3/MontfauconHaroldEye.jpg\n','overwrite','222445'),
(14,'Etna, California','122° 53′ 49″ W','41° 27′ 26″ N','Etna is a city in the Scott Valle','https://upload.wikimedia.org/wikipedia/commons/9/9c/Odo_bayeux_tapestry.png\nhttps://upload.wikimedia.org/wikipedia/commons/d/d3/MontfauconHaroldEye.jpg\n','merge','223059');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
