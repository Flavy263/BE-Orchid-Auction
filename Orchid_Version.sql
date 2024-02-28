USE [master]
GO
/****** Object:  Database [OrchidAuction]    Script Date: 2/28/2024 9:24:21 PM ******/
CREATE DATABASE [OrchidAuction]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'OrchidAuction', FILENAME = N'D:\Databases\MSSQL15.SQLSERVER\MSSQL\DATA\OrchidAuction.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'OrchidAuction_log', FILENAME = N'D:\Databases\MSSQL15.SQLSERVER\MSSQL\DATA\OrchidAuction_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [OrchidAuction] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [OrchidAuction].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [OrchidAuction] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [OrchidAuction] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [OrchidAuction] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [OrchidAuction] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [OrchidAuction] SET ARITHABORT OFF 
GO
ALTER DATABASE [OrchidAuction] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [OrchidAuction] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [OrchidAuction] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [OrchidAuction] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [OrchidAuction] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [OrchidAuction] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [OrchidAuction] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [OrchidAuction] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [OrchidAuction] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [OrchidAuction] SET  ENABLE_BROKER 
GO
ALTER DATABASE [OrchidAuction] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [OrchidAuction] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [OrchidAuction] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [OrchidAuction] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [OrchidAuction] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [OrchidAuction] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [OrchidAuction] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [OrchidAuction] SET RECOVERY FULL 
GO
ALTER DATABASE [OrchidAuction] SET  MULTI_USER 
GO
ALTER DATABASE [OrchidAuction] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [OrchidAuction] SET DB_CHAINING OFF 
GO
ALTER DATABASE [OrchidAuction] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [OrchidAuction] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [OrchidAuction] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [OrchidAuction] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'OrchidAuction', N'ON'
GO
ALTER DATABASE [OrchidAuction] SET QUERY_STORE = OFF
GO
USE [OrchidAuction]
GO
/****** Object:  Table [dbo].[Auction]    Script Date: 2/28/2024 9:24:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Auction](
	[id] [uniqueidentifier] NOT NULL,
	[minimum_price_step] [float] NULL,
	[start_time] [datetime] NULL,
	[end_time] [datetime] NULL,
	[registration_start_time] [datetime] NULL,
	[registration_end_time] [datetime] NULL,
	[status] [nvarchar](15) NULL,
	[host_id] [uniqueidentifier] NULL,
	[product_id] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Auction_Bid]    Script Date: 2/28/2024 9:24:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Auction_Bid](
	[id] [uniqueidentifier] NOT NULL,
	[auction_id] [uniqueidentifier] NULL,
	[customer_id] [uniqueidentifier] NULL,
	[price] [float] NULL,
	[create_time] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order]    Script Date: 2/28/2024 9:24:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order](
	[id] [uniqueidentifier] NOT NULL,
	[winner_id] [uniqueidentifier] NULL,
	[auction_id] [uniqueidentifier] NULL,
	[host_id] [uniqueidentifier] NULL,
	[status] [bit] NULL,
	[price] [float] NULL,
	[date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]    Script Date: 2/28/2024 9:24:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](255) NULL,
	[image] [nvarchar](max) NULL,
	[video] [nvarchar](max) NULL,
	[description] [nvarchar](max) NULL,
	[price] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 2/28/2024 9:24:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[id] [uniqueidentifier] NOT NULL,
	[title] [nvarchar](255) NULL,
	[description] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 2/28/2024 9:24:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[id] [uniqueidentifier] NOT NULL,
	[full_name] [nvarchar](255) NULL,
	[gender] [nvarchar](10) NULL,
	[phone] [nvarchar](20) NULL,
	[email] [nvarchar](255) NULL,
	[address] [nvarchar](255) NULL,
	[image] [nvarchar](max) NULL,
	[status] [bit] NULL,
	[user_name] [nvarchar](50) NULL,
	[password] [nvarchar](255) NULL,
	[role_id] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Wallet]    Script Date: 2/28/2024 9:24:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Wallet](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[balance] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Wallet_History]    Script Date: 2/28/2024 9:24:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Wallet_History](
	[id] [uniqueidentifier] NOT NULL,
	[wallet_id] [uniqueidentifier] NULL,
	[money_change] [float] NULL,
	[history_time] [datetime] NULL,
	[status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Wallet_Request]    Script Date: 2/28/2024 9:24:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Wallet_Request](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[money_request] [float] NULL,
	[status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Auction] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Auction_Bid] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Order] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Product] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Role] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[User] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Wallet] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Wallet_History] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Wallet_Request] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Auction]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[Product] ([id])
GO
ALTER TABLE [dbo].[Auction_Bid]  WITH CHECK ADD FOREIGN KEY([auction_id])
REFERENCES [dbo].[Auction] ([id])
GO
ALTER TABLE [dbo].[Auction_Bid]  WITH CHECK ADD FOREIGN KEY([customer_id])
REFERENCES [dbo].[User] ([id])
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD FOREIGN KEY([auction_id])
REFERENCES [dbo].[Auction] ([id])
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD FOREIGN KEY([host_id])
REFERENCES [dbo].[User] ([id])
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD FOREIGN KEY([winner_id])
REFERENCES [dbo].[User] ([id])
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[Role] ([id])
GO
ALTER TABLE [dbo].[Wallet]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[User] ([id])
GO
ALTER TABLE [dbo].[Wallet_History]  WITH CHECK ADD FOREIGN KEY([wallet_id])
REFERENCES [dbo].[Wallet] ([id])
GO
ALTER TABLE [dbo].[Wallet_Request]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[User] ([id])
GO
USE [master]
GO
ALTER DATABASE [OrchidAuction] SET  READ_WRITE 
GO
