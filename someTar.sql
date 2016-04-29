/*
 Navicat Premium Data Transfer

 Source Server         : aws rds
 Source Server Type    : MySQL
 Source Server Version : 50627
 Source Host           : awsdbinstance.ctgrun1qbjn8.ap-northeast-2.rds.amazonaws.com
 Source Database       : someTar

 Target Server Type    : MySQL
 Target Server Version : 50627
 File Encoding         : utf-8

 Date: 04/30/2016 02:04:59 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `Answer`
-- ----------------------------
DROP TABLE IF EXISTS `Answer`;
CREATE TABLE `Answer` (
  `qId` int(11) NOT NULL,
  `ansId` int(11) NOT NULL AUTO_INCREMENT,
  `seq` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `explanation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ansId`),
  KEY `qId` (`qId`),
  CONSTRAINT `qId in Answer` FOREIGN KEY (`qId`) REFERENCES `Question` (`qId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `Question`
-- ----------------------------
DROP TABLE IF EXISTS `Question`;
CREATE TABLE `Question` (
  `qId` int(11) NOT NULL AUTO_INCREMENT,
  `starId` int(11) NOT NULL,
  `seq` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  PRIMARY KEY (`qId`),
  KEY `starId` (`starId`),
  CONSTRAINT `starId in Question` FOREIGN KEY (`starId`) REFERENCES `Star` (`starId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `Star`
-- ----------------------------
DROP TABLE IF EXISTS `Star`;
CREATE TABLE `Star` (
  `starId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `useFlag` int(11) DEFAULT '0',
  PRIMARY KEY (`starId`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `UserAnswer`
-- ----------------------------
DROP TABLE IF EXISTS `UserAnswer`;
CREATE TABLE `UserAnswer` (
  `chatId` int(11) NOT NULL,
  `starId` int(11) NOT NULL,
  `qId` int(11) NOT NULL,
  `ansId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `UserState`
-- ----------------------------
DROP TABLE IF EXISTS `UserState`;
CREATE TABLE `UserState` (
  `chatId` varchar(255) NOT NULL,
  `starId` int(11) DEFAULT NULL,
  `qId` int(11) DEFAULT NULL,
  KEY `starId` (`starId`),
  CONSTRAINT `starId in UserState` FOREIGN KEY (`starId`) REFERENCES `Star` (`starId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
