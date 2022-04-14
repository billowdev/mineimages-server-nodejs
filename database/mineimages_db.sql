-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 14, 2022 at 02:17 AM
-- Server version: 8.0.28-0ubuntu0.20.04.3
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mineimages_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Addresses`
--

CREATE TABLE `Addresses` (
  `id` int NOT NULL,
  `addressLine1` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addressLine2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postalCode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Addresses`
--

INSERT INTO `Addresses` (`id`, `addressLine1`, `addressLine2`, `city`, `postalCode`, `country`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, '', NULL, '', '', '', '2022-04-14 06:59:59', '2022-04-14 06:59:59', '3e812c72-2b52-49dd-8ae3-7f307fb76b45'),
(3, '', NULL, '', '', '', '2022-04-14 07:07:38', '2022-04-14 07:07:38', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
(4, '119', 'San josei', 'nep', '1922', 'ouside the world', '2022-04-14 07:08:43', '2022-04-14 07:08:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Categories`
--

CREATE TABLE `Categories` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Categories`
--

INSERT INTO `Categories` (`id`, `name`, `desc`, `createdAt`, `updatedAt`) VALUES
(1, 'general', 'general', '2022-04-14 07:09:37', '2022-04-14 07:09:55'),
(2, 'animal', 'animal', '2022-04-14 07:09:46', '2022-04-14 07:09:46'),
(3, 'natural', 'natural', '2022-04-14 07:10:12', '2022-04-14 07:10:12'),
(4, 'tech', 'tech', '2022-04-14 07:10:19', '2022-04-14 07:10:19');

-- --------------------------------------------------------

--
-- Table structure for table `Images`
--

CREATE TABLE `Images` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `publicId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pathOrigin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pathWatermark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'https://res.cloudinary.com/dnshsje8a/image/upload/v1647843792/default/5203299_id0fbv.jpg',
  `price` decimal(10,0) NOT NULL DEFAULT '0',
  `visible` enum('public','private') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `remove` enum('YES','NO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NO',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `CategoryId` int DEFAULT NULL,
  `UserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Images`
--

INSERT INTO `Images` (`id`, `publicId`, `name`, `detail`, `pathOrigin`, `pathWatermark`, `price`, `visible`, `status`, `remove`, `createdAt`, `updatedAt`, `CategoryId`, `UserId`) VALUES
('285e8fcd-8176-4675-8603-071bdbf1dc84', 'mineimages/watermark/n7vg5upijbbxtymvhfet', 'test7', 'test7', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924140/mineimages/original/to5ncauaroflxpimslbc.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924154/mineimages/watermark/n7vg5upijbbxtymvhfet.jpg', '1233', 'public', 'active', 'NO', '2022-04-14 08:15:55', '2022-04-14 08:15:55', 1, '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('3c8420f0-8916-4aa0-b540-805b1bf8128f', 'mineimages/watermark/u09xr6uihmpgce82fsto', 'test2', 'test2', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649923595/mineimages/original/eocc6zaty2zbeepomsy2.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649923614/mineimages/watermark/u09xr6uihmpgce82fsto.jpg', '444', 'public', 'active', 'NO', '2022-04-14 08:06:56', '2022-04-14 08:06:56', 1, '3e812c72-2b52-49dd-8ae3-7f307fb76b45'),
('3d8370b5-c352-4235-bc03-30e1bdc5c26d', 'mineimages/watermark/wsadxs6leey0yepaebi9', 'test13', '', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924322/mineimages/original/dcvxjfyrbxlxdzpr5kzb.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924335/mineimages/watermark/wsadxs6leey0yepaebi9.jpg', '666', 'public', 'active', 'NO', '2022-04-14 08:18:55', '2022-04-14 08:18:55', 4, '3e812c72-2b52-49dd-8ae3-7f307fb76b45'),
('640d0ead-0e43-4c82-888d-899545e5740f', 'mineimages/watermark/zzrnlhoqx6d9bojygrix', 'test5', '', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924108/mineimages/original/qfjauclpfr5cyqsila1o.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924119/mineimages/watermark/zzrnlhoqx6d9bojygrix.jpg', '522', 'public', 'active', 'NO', '2022-04-14 08:15:20', '2022-04-14 08:15:20', 3, '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('65b2ea51-9dca-477a-8b8f-d5416c4c05bf', 'mineimages/watermark/ngzmxypfbxobvumsmlcg', 'test12', '', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924311/mineimages/original/u4afd3qszttustb99poq.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924334/mineimages/watermark/ngzmxypfbxobvumsmlcg.jpg', '123', 'public', 'active', 'NO', '2022-04-14 08:18:55', '2022-04-14 08:18:55', 1, '3e812c72-2b52-49dd-8ae3-7f307fb76b45'),
('7572131b-0309-442d-97a2-368153585365', 'mineimages/watermark/pbn4tymfnbznuftyjwr2', 'test4', 'test4', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924090/mineimages/original/ojkjeq70ffyegu8arzud.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924101/mineimages/watermark/pbn4tymfnbznuftyjwr2.jpg', '500', 'public', 'active', 'NO', '2022-04-14 08:15:02', '2022-04-14 08:15:02', 1, '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('b8519328-d3ee-40b1-8f3f-3374c97d5f2b', 'mineimages/watermark/wfzqkettpocqaqao1uma', 'test8', '', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924268/mineimages/original/xzgasz2qgvwniaxe8v4y.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924274/mineimages/watermark/wfzqkettpocqaqao1uma.jpg', '222', 'public', 'active', 'NO', '2022-04-14 08:17:55', '2022-04-14 08:17:55', 1, '3e812c72-2b52-49dd-8ae3-7f307fb76b45'),
('c0d3b80f-f380-4522-9e6a-ed9042f01689', 'mineimages/watermark/xe00zubqlgroaedhoegf', 'test1', 'test1', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649920858/mineimages/original/hrokqtcdxkjib0ggbbnw.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649920867/mineimages/watermark/xe00zubqlgroaedhoegf.jpg', '500', 'public', 'active', 'NO', '2022-04-14 07:21:08', '2022-04-14 07:21:08', 1, '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('cc13c2da-44a3-4e85-86e6-4a95b2b029e0', 'mineimages/watermark/xizjbseuanh72lmkjcpl', 'test10', '', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924290/mineimages/original/zzbevssf722fqkfveyrn.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924307/mineimages/watermark/xizjbseuanh72lmkjcpl.jpg', '333', 'public', 'active', 'NO', '2022-04-14 08:18:28', '2022-04-14 08:18:28', 1, '3e812c72-2b52-49dd-8ae3-7f307fb76b45'),
('d1db84fb-1749-4f7d-bc0a-d38d969ffaf0', 'mineimages/watermark/gb0rvfyf8ukjl4mcvoc8', 'test11', '', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924298/mineimages/original/xjuokapghvc5yww5wbng.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924302/mineimages/watermark/gb0rvfyf8ukjl4mcvoc8.jpg', '888', 'public', 'active', 'NO', '2022-04-14 08:18:23', '2022-04-14 08:18:23', 1, '3e812c72-2b52-49dd-8ae3-7f307fb76b45'),
('d74150d0-3f79-4e4e-947e-00101da6ce7e', 'mineimages/watermark/kiwulf5svzkugletmltf', 'test3', '', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924072/mineimages/original/bvxmgumsakn0xgj7dfcp.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924078/mineimages/watermark/kiwulf5svzkugletmltf.jpg', '777', 'public', 'active', 'NO', '2022-04-14 08:14:39', '2022-04-14 08:14:39', 1, '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('da3f6603-1cc6-47c7-80e0-6b78d6782343', 'mineimages/watermark/cpr6io5w3wou9tz29vgw', 'test6', '', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924123/mineimages/original/nlh0ycf8tugmkz3y5dqw.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924138/mineimages/watermark/cpr6io5w3wou9tz29vgw.jpg', '880', 'public', 'active', 'NO', '2022-04-14 08:15:39', '2022-04-14 08:15:39', 1, '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('e0c8a6d5-938c-4806-80b0-0b3c92978b0c', 'mineimages/watermark/by3ptn3lbddttejvu1m4', 'test9', '', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924280/mineimages/original/mvelj5ivb4asp5vlvmwl.jpg', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924288/mineimages/watermark/by3ptn3lbddttejvu1m4.jpg', '333', 'public', 'active', 'NO', '2022-04-14 08:18:09', '2022-04-14 08:18:09', 1, '3e812c72-2b52-49dd-8ae3-7f307fb76b45');

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `status` enum('oncart','complete','transaction') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'oncart',
  `price` decimal(10,0) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ImageId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `UserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `TransactionId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`id`, `status`, `price`, `createdAt`, `updatedAt`, `ImageId`, `UserId`, `TransactionId`) VALUES
('15d5a180-bbcb-11ec-9ff8-1156210e6709', 'complete', '444', '2022-04-14 08:15:46', '2022-04-14 08:15:56', '3c8420f0-8916-4aa0-b540-805b1bf8128f', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f', '182efad0-bbcb-11ec-9ff8-1156210e6709'),
('1f4cc490-bbcc-11ec-9ff8-1156210e6709', 'transaction', '333', '2022-04-14 08:23:11', '2022-04-14 08:33:23', 'cc13c2da-44a3-4e85-86e6-4a95b2b029e0', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f', '8c4a6ba0-bbcd-11ec-9ff8-1156210e6709'),
('35c97380-bbcc-11ec-9ff8-1156210e6709', 'oncart', '1233', '2022-04-14 08:23:49', '2022-04-14 08:23:49', '285e8fcd-8176-4675-8603-071bdbf1dc84', '3e812c72-2b52-49dd-8ae3-7f307fb76b45', NULL),
('51794520-bbcb-11ec-9ff8-1156210e6709', 'complete', '522', '2022-04-14 08:17:26', '2022-04-14 08:19:29', '640d0ead-0e43-4c82-888d-899545e5740f', '3e812c72-2b52-49dd-8ae3-7f307fb76b45', '56fc6720-bbcb-11ec-9ff8-1156210e6709'),
('523c6e10-bbcb-11ec-9ff8-1156210e6709', 'complete', '500', '2022-04-14 08:17:27', '2022-04-14 08:19:29', '7572131b-0309-442d-97a2-368153585365', '3e812c72-2b52-49dd-8ae3-7f307fb76b45', '56fc6720-bbcb-11ec-9ff8-1156210e6709'),
('53ac2ab0-bbcb-11ec-9ff8-1156210e6709', 'complete', '777', '2022-04-14 08:17:29', '2022-04-14 08:19:29', 'd74150d0-3f79-4e4e-947e-00101da6ce7e', '3e812c72-2b52-49dd-8ae3-7f307fb76b45', '56fc6720-bbcb-11ec-9ff8-1156210e6709'),
('54556300-bbcb-11ec-9ff8-1156210e6709', 'complete', '880', '2022-04-14 08:17:30', '2022-04-14 08:19:29', 'da3f6603-1cc6-47c7-80e0-6b78d6782343', '3e812c72-2b52-49dd-8ae3-7f307fb76b45', '56fc6720-bbcb-11ec-9ff8-1156210e6709'),
('922ed260-bbcb-11ec-9ff8-1156210e6709', 'complete', '333', '2022-04-14 08:19:14', '2022-04-14 08:19:31', 'e0c8a6d5-938c-4806-80b0-0b3c92978b0c', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f', '95023db0-bbcb-11ec-9ff8-1156210e6709'),
('92f02690-bbcb-11ec-9ff8-1156210e6709', 'complete', '888', '2022-04-14 08:19:15', '2022-04-14 08:19:31', 'd1db84fb-1749-4f7d-bc0a-d38d969ffaf0', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f', '95023db0-bbcb-11ec-9ff8-1156210e6709'),
('aadc6b10-bbcb-11ec-9ff8-1156210e6709', 'complete', '123', '2022-04-14 08:19:56', '2022-04-14 08:20:14', '65b2ea51-9dca-477a-8b8f-d5416c4c05bf', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f', 'b29b4c40-bbcb-11ec-9ff8-1156210e6709'),
('ad882a20-bbcb-11ec-9ff8-1156210e6709', 'complete', '222', '2022-04-14 08:20:00', '2022-04-14 08:20:14', 'b8519328-d3ee-40b1-8f3f-3374c97d5f2b', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f', 'b29b4c40-bbcb-11ec-9ff8-1156210e6709'),
('b0831aa0-bbcb-11ec-9ff8-1156210e6709', 'complete', '666', '2022-04-14 08:20:05', '2022-04-14 08:20:14', '3d8370b5-c352-4235-bc03-30e1bdc5c26d', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f', 'b29b4c40-bbcb-11ec-9ff8-1156210e6709'),
('b9708630-bbca-11ec-9ff8-1156210e6709', 'complete', '500', '2022-04-14 08:13:11', '2022-04-14 08:13:41', 'c0d3b80f-f380-4522-9e6a-ed9042f01689', '3e812c72-2b52-49dd-8ae3-7f307fb76b45', 'bc182690-bbca-11ec-9ff8-1156210e6709');

-- --------------------------------------------------------

--
-- Table structure for table `Transactions`
--

CREATE TABLE `Transactions` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `status` enum('complete','pending','incomeplete') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Transactions`
--

INSERT INTO `Transactions` (`id`, `status`, `createdAt`, `updatedAt`, `UserId`) VALUES
('182efad0-bbcb-11ec-9ff8-1156210e6709', 'complete', '2022-04-14 08:15:50', '2022-04-14 08:15:56', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('56fc6720-bbcb-11ec-9ff8-1156210e6709', 'complete', '2022-04-14 08:17:35', '2022-04-14 08:19:29', '3e812c72-2b52-49dd-8ae3-7f307fb76b45'),
('8c4a6ba0-bbcd-11ec-9ff8-1156210e6709', 'pending', '2022-04-14 08:33:23', '2022-04-14 08:33:23', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('95023db0-bbcb-11ec-9ff8-1156210e6709', 'complete', '2022-04-14 08:19:19', '2022-04-14 08:19:31', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('b29b4c40-bbcb-11ec-9ff8-1156210e6709', 'complete', '2022-04-14 08:20:09', '2022-04-14 08:20:14', '22d55cd9-e15d-4bab-bd01-36c914b1aa3f'),
('bc182690-bbca-11ec-9ff8-1156210e6709', 'complete', '2022-04-14 08:13:15', '2022-04-14 08:13:41', '3e812c72-2b52-49dd-8ae3-7f307fb76b45');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avartar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'https://res.cloudinary.com/dnshsje8a/image/upload/v1647766908/Avatar/user_1_dezkrz.png',
  `about` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permission` enum('admin','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `password`, `email`, `firstName`, `lastName`, `telephone`, `avartar`, `about`, `permission`, `status`, `createdAt`, `updatedAt`) VALUES
('22d55cd9-e15d-4bab-bd01-36c914b1aa3f', '$2a$10$qpdlR3kvnomsaK3M.ux3Z.iXdF/dxkuZ3Ky6AXf.hXyrvuhPO13R2', 'admin', 'admin', 'admin', '0987362123', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649920898/mineimages/profiles/h3u8n8u7jzrcoivqgvbd.jpg', NULL, 'admin', 'inactive', '2022-04-14 07:07:38', '2022-04-14 08:30:21'),
('3e812c72-2b52-49dd-8ae3-7f307fb76b45', '$2a$10$odBVRT691VNNmOV03oi6..zdn1BD0FN/EeA.v5GP7EKfvpEbacm6G', 'test1@gmail.com', 'test1', 'test11', '0836172312', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1649924773/mineimages/profiles/uvo4y9cdj84mywpaio4a.png', NULL, 'user', 'active', '2022-04-14 06:59:59', '2022-04-14 08:26:50'),
('9a3bafb9-3d03-49b5-aa2d-a4fbb54c6349', '$2a$10$OaWQTHyKao8RxUdvVYHf..IZelHOtVewTnIICBbTJvuozvlMYerie', 'test3@gmail.com', 'test3', 'test3', '0987123871', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1647766908/Avatar/user_1_dezkrz.png', 'test3', 'user', 'active', '2022-04-14 07:09:15', '2022-04-14 07:09:15'),
('e40b74da-30b9-4afc-95d1-c20818b45d5d', '$2a$10$QoBz7pdRb9TKouLlm6tEfetLuKoZiQADi0yL/GyyS52Ry7R14AKPi', 'test22@gmail.com', 'test2', 'test2', '1231231231', 'https://res.cloudinary.com/dnshsje8a/image/upload/v1647766908/Avatar/user_1_dezkrz.png', '123123', 'user', 'active', '2022-04-14 07:08:43', '2022-04-14 07:08:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Addresses`
--
ALTER TABLE `Addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `Categories`
--
ALTER TABLE `Categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Images`
--
ALTER TABLE `Images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CategoryId` (`CategoryId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ImageId` (`ImageId`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `TransactionId` (`TransactionId`);

--
-- Indexes for table `Transactions`
--
ALTER TABLE `Transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Addresses`
--
ALTER TABLE `Addresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Categories`
--
ALTER TABLE `Categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Addresses`
--
ALTER TABLE `Addresses`
  ADD CONSTRAINT `Addresses_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Images`
--
ALTER TABLE `Images`
  ADD CONSTRAINT `Images_ibfk_1` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Images_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`ImageId`) REFERENCES `Images` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Orders_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Orders_ibfk_3` FOREIGN KEY (`TransactionId`) REFERENCES `Transactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Transactions`
--
ALTER TABLE `Transactions`
  ADD CONSTRAINT `Transactions_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
