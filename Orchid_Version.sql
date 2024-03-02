USE [master]
GO
/****** Object:  Database [OrchidAuction]    Script Date: 3/2/2024 4:43:07 PM ******/
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
/****** Object:  Table [dbo].[Auction]    Script Date: 3/2/2024 4:43:07 PM ******/
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
/****** Object:  Table [dbo].[Auction_Bid]    Script Date: 3/2/2024 4:43:07 PM ******/
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
/****** Object:  Table [dbo].[Order]    Script Date: 3/2/2024 4:43:07 PM ******/
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
/****** Object:  Table [dbo].[Product]    Script Date: 3/2/2024 4:43:07 PM ******/
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
/****** Object:  Table [dbo].[Role]    Script Date: 3/2/2024 4:43:07 PM ******/
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
/****** Object:  Table [dbo].[User]    Script Date: 3/2/2024 4:43:07 PM ******/
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
/****** Object:  Table [dbo].[Wallet]    Script Date: 3/2/2024 4:43:07 PM ******/
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
/****** Object:  Table [dbo].[Wallet_History]    Script Date: 3/2/2024 4:43:07 PM ******/
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
/****** Object:  Table [dbo].[Wallet_Request]    Script Date: 3/2/2024 4:43:07 PM ******/
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
INSERT [dbo].[Auction] ([id], [minimum_price_step], [start_time], [end_time], [registration_start_time], [registration_end_time], [status], [host_id], [product_id]) VALUES (N'ca898758-8948-4bf1-8c12-01911450164b', 10000, CAST(N'2024-01-05T08:00:00.000' AS DateTime), CAST(N'2024-01-06T10:00:00.000' AS DateTime), CAST(N'2024-01-02T00:00:00.000' AS DateTime), CAST(N'2024-01-04T00:00:00.000' AS DateTime), N'1', N'63aa7c65-c696-4d03-aba2-f3c61f990236', N'28e2a09a-b72e-40e1-beb3-2f0063aa825d')
INSERT [dbo].[Auction] ([id], [minimum_price_step], [start_time], [end_time], [registration_start_time], [registration_end_time], [status], [host_id], [product_id]) VALUES (N'931ada32-7abd-4fc0-ab57-5bec3ead8edf', 10000, CAST(N'2024-03-25T14:00:00.000' AS DateTime), CAST(N'2024-03-26T10:00:00.000' AS DateTime), CAST(N'2024-01-22T00:00:00.000' AS DateTime), CAST(N'2024-01-24T00:00:00.000' AS DateTime), N'1', N'a01ad597-2e87-49be-b9db-006ee1e3fcd7', N'039a3f20-61b4-4fe0-8604-d012562cb96d')
INSERT [dbo].[Auction] ([id], [minimum_price_step], [start_time], [end_time], [registration_start_time], [registration_end_time], [status], [host_id], [product_id]) VALUES (N'93ee0990-c864-4d48-9a4a-9657daae3694', 10000, CAST(N'2024-05-10T14:00:00.000' AS DateTime), CAST(N'2024-05-12T10:00:00.000' AS DateTime), CAST(N'2024-01-07T00:00:00.000' AS DateTime), CAST(N'2024-01-09T00:00:00.000' AS DateTime), N'1', N'9509a195-6356-4565-8913-d63b09f839d3', N'07fc218a-98d3-4837-9101-ef65abb36b4d')
INSERT [dbo].[Auction] ([id], [minimum_price_step], [start_time], [end_time], [registration_start_time], [registration_end_time], [status], [host_id], [product_id]) VALUES (N'67e5432e-ace7-4be7-89c8-b18623600594', 10000, CAST(N'2024-07-15T14:00:00.000' AS DateTime), CAST(N'2024-07-16T10:00:00.000' AS DateTime), CAST(N'2024-01-12T00:00:00.000' AS DateTime), CAST(N'2024-01-14T00:00:00.000' AS DateTime), N'1', N'b321965a-a64e-4f44-bd3a-6df0b87e07df', N'c7a16d08-9bc8-41a6-aa62-63a666e59879')
INSERT [dbo].[Auction] ([id], [minimum_price_step], [start_time], [end_time], [registration_start_time], [registration_end_time], [status], [host_id], [product_id]) VALUES (N'cf69a2a7-1ab6-422d-bc53-fdc866696f63', 10000, CAST(N'2024-09-20T14:00:00.000' AS DateTime), CAST(N'2024-09-21T10:00:00.000' AS DateTime), CAST(N'2024-01-17T00:00:00.000' AS DateTime), CAST(N'2024-01-19T00:00:00.000' AS DateTime), N'1', N'97d741f4-7891-4dce-9fb9-a524e3180d2f', N'825a19b1-34e9-4ee5-abe0-75f92368469c')
GO
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'b0a20cca-0a09-44ea-b6b8-073dc98dfe6d', N'67e5432e-ace7-4be7-89c8-b18623600594', N'ab291ffc-63f4-4da4-b7df-70d30f162ebe', 24000, CAST(N'2024-07-15T16:30:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'b5a1dcb2-41f5-42c8-b2c4-155a778b94be', N'67e5432e-ace7-4be7-89c8-b18623600594', N'83b5cd86-ba34-499c-bbdf-1d6cdd1877fb', 37000, CAST(N'2024-07-15T18:40:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'1d07a8f4-9004-4cf0-a133-1b62e93a54fa', N'ca898758-8948-4bf1-8c12-01911450164b', N'83b5cd86-ba34-499c-bbdf-1d6cdd1877fb', 15000, CAST(N'2024-01-05T10:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'd50deacb-0201-46e3-9f96-24d3c1af0a7c', N'931ada32-7abd-4fc0-ab57-5bec3ead8edf', N'a01ad597-2e87-49be-b9db-006ee1e3fcd7', 17000, CAST(N'2024-03-25T16:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'ab45a737-a7d7-426c-b6f7-264ce327dbd3', N'ca898758-8948-4bf1-8c12-01911450164b', N'2a76856b-85cf-4c3d-a173-969673884f31', 20000, CAST(N'2024-01-05T12:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'7beb9c3d-d88d-4724-8873-26bc0cfa9ece', N'67e5432e-ace7-4be7-89c8-b18623600594', N'e1e445d7-cd39-4294-a1c5-60df032db316', 50000, CAST(N'2024-07-15T22:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'5bfe48a3-9a0c-4abc-8ee6-43c3919fe84c', N'931ada32-7abd-4fc0-ab57-5bec3ead8edf', N'ab291ffc-63f4-4da4-b7df-70d30f162ebe', 23000, CAST(N'2024-03-25T18:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'a252a776-e44d-4f3c-84d7-69e482057311', N'93ee0990-c864-4d48-9a4a-9657daae3694', N'b321965a-a64e-4f44-bd3a-6df0b87e07df', 35000, CAST(N'2024-05-10T20:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'140317e8-28db-4b88-bd66-73f72676b1d2', N'93ee0990-c864-4d48-9a4a-9657daae3694', N'8d4353da-c884-4c5d-a3ae-ec6ac06398f0', 33000, CAST(N'2024-05-10T19:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'1722a8dc-4d6b-4b63-9450-8cff76fb756f', N'931ada32-7abd-4fc0-ab57-5bec3ead8edf', N'1f2f11c1-6e5a-4843-a959-776602be43ea', 30000, CAST(N'2024-03-25T20:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'6c0bf1f9-24c4-4141-951e-8f4f10df9527', N'93ee0990-c864-4d48-9a4a-9657daae3694', N'2a84a803-ecd6-47c7-b2d2-7585d1d38b11', 20000, CAST(N'2024-05-10T17:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'6666dd70-0c89-46f2-9214-958221458950', N'cf69a2a7-1ab6-422d-bc53-fdc866696f63', N'9dc673d7-9715-41f8-a9b0-75dc57a2710c', 50000, CAST(N'2024-09-20T20:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'4bfbd38f-c5c0-4175-b5ff-9c9251b2509f', N'cf69a2a7-1ab6-422d-bc53-fdc866696f63', N'b0815661-025d-4131-9b89-28fe3137a8ef', 12000, CAST(N'2024-09-20T19:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'fd727683-5b34-48e8-a6bd-b15310a0fdcc', N'cf69a2a7-1ab6-422d-bc53-fdc866696f63', N'a01ad597-2e87-49be-b9db-006ee1e3fcd7', 70000, CAST(N'2024-09-20T23:00:00.000' AS DateTime))
INSERT [dbo].[Auction_Bid] ([id], [auction_id], [customer_id], [price], [create_time]) VALUES (N'293f431a-3064-4a15-9297-c7bb4def79ab', N'ca898758-8948-4bf1-8c12-01911450164b', N'71dc4920-0c85-40ff-b9bc-d01a9b8b671b', 22000, CAST(N'2024-01-05T13:00:00.000' AS DateTime))
GO
INSERT [dbo].[Order] ([id], [winner_id], [auction_id], [host_id], [status], [price], [date]) VALUES (N'2d209ac4-32b8-4f5b-8abb-2ec7ae3c5274', N'b321965a-a64e-4f44-bd3a-6df0b87e07df', N'93ee0990-c864-4d48-9a4a-9657daae3694', N'97d741f4-7891-4dce-9fb9-a524e3180d2f', 1, 35000, CAST(N'2024-05-10T20:00:00.000' AS DateTime))
INSERT [dbo].[Order] ([id], [winner_id], [auction_id], [host_id], [status], [price], [date]) VALUES (N'b28ddd49-bda5-45c3-8d28-3648de9e9df2', N'e1e445d7-cd39-4294-a1c5-60df032db316', N'67e5432e-ace7-4be7-89c8-b18623600594', N'63aa7c65-c696-4d03-aba2-f3c61f990236', 1, 50000, CAST(N'2024-07-15T22:00:00.000' AS DateTime))
INSERT [dbo].[Order] ([id], [winner_id], [auction_id], [host_id], [status], [price], [date]) VALUES (N'3b3f9ee2-15c6-4ea2-aa30-36cb3e87af93', N'a01ad597-2e87-49be-b9db-006ee1e3fcd7', N'cf69a2a7-1ab6-422d-bc53-fdc866696f63', N'b321965a-a64e-4f44-bd3a-6df0b87e07df', 1, 70000, CAST(N'2024-09-20T23:00:00.000' AS DateTime))
INSERT [dbo].[Order] ([id], [winner_id], [auction_id], [host_id], [status], [price], [date]) VALUES (N'0f53fd30-248d-4a9b-b1cf-7ae9a3a1540d', N'1f2f11c1-6e5a-4843-a959-776602be43ea', N'931ada32-7abd-4fc0-ab57-5bec3ead8edf', N'9509a195-6356-4565-8913-d63b09f839d3', 1, 30000, CAST(N'2024-03-25T20:00:00.000' AS DateTime))
INSERT [dbo].[Order] ([id], [winner_id], [auction_id], [host_id], [status], [price], [date]) VALUES (N'16fd8d84-7d4d-4bdf-8750-fea7fbce70f8', N'71dc4920-0c85-40ff-b9bc-d01a9b8b671b', N'ca898758-8948-4bf1-8c12-01911450164b', N'a01ad597-2e87-49be-b9db-006ee1e3fcd7', 1, 22000, CAST(N'2024-01-05T13:00:00.000' AS DateTime))
GO
INSERT [dbo].[Product] ([id], [name], [image], [video], [description], [price]) VALUES (N'28e2a09a-b72e-40e1-beb3-2f0063aa825d', N'Phalaenopsis Sparkle Burst', N'https://cdn11.bigcommerce.com/s-pxrevx9n0f/images/stencil/1280x1280/products/1969/8079/P._Da_Shang_Sparkle_Fire1__14499.1585604433.jpg?c=2', N'orchid_video.mp4', N'Color: Pastel pink with miners. Design: Outstanding star-shaped petals. Scent: Intense, sweet scent.', 200000)
INSERT [dbo].[Product] ([id], [name], [image], [video], [description], [price]) VALUES (N'c7a16d08-9bc8-41a6-aa62-63a666e59879', N'Dendrobium Mystic Veil', N'https://i.etsystatic.com/28667733/r/il/50cbc2/3019080937/il_570xN.3019080937_gufi.jpg', N'orchid_video.mp4', N'Color: Pearl flower shell, creating a mysterious color effect. Design: Delicate small cluster of flowers. Scent: Gentle herbal scent.', 200000)
INSERT [dbo].[Product] ([id], [name], [image], [video], [description], [price]) VALUES (N'825a19b1-34e9-4ee5-abe0-75f92368469c', N'Vanda Mystic Mist', N'https://static.vecteezy.com/system/resources/thumbnails/001/622/022/original/vanda-orchid-flower-in-garden-at-winter-or-spring-day-video.jpg', N'orchid_video.mp4', N'Color: Dark purple with light haze. Design: Flowers are large and round. Scent: Intense, seductive scent.', 200000)
INSERT [dbo].[Product] ([id], [name], [image], [video], [description], [price]) VALUES (N'039a3f20-61b4-4fe0-8604-d012562cb96d', N'Cymbidium Rainbow Splash', N'https://1001leaves.com/cdn/shop/products/4_e0bec01e-4b3e-4024-8751-20a648af3288.jpg?v=1673311478', N'orchid_video.mp4', N'Color: Various colors from red, orange, yellow to green. Design: Nose-shaped flower cluster with colorful colors. Scent: Delicate, pleasant scent.', 200000)
INSERT [dbo].[Product] ([id], [name], [image], [video], [description], [price]) VALUES (N'07fc218a-98d3-4837-9101-ef65abb36b4d', N'Oncidium Galaxy Swirl', N'https://homegardeningph.files.wordpress.com/2015/07/equitant_oncidium_orchid_plant.jpg', N'orchid_video.mp4', N'Color: Bright colored circles on petals. Design: Strong flower branch curved like the universe. Scent: Fresh scent.', 200000)
GO
INSERT [dbo].[Role] ([id], [title], [description]) VALUES (N'189c2bbf-9245-43c1-9030-18a59a2ae37c', N'Host', N'Auction Host')
INSERT [dbo].[Role] ([id], [title], [description]) VALUES (N'3497382f-72f2-4b58-9293-904709d02c54', N'Admin', N'System Administrator')
INSERT [dbo].[Role] ([id], [title], [description]) VALUES (N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af', N'Member', N'Auction Member')
GO
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'23f30915-0d91-4f3c-b9a8-002427fed3b7', N'Richard Martinez', N'Male', N'0935678901', N'richardmartinez@gmail.com', N'210 Highland Crescent, Cardiff, Wales', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'ZenHarbinger', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'a01ad597-2e87-49be-b9db-006ee1e3fcd7', N'Laura Davis', N'Female', N'0945678901', N'lauradavis@gmail.com', N'101 Elm Road, Birmingham, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'NatureLover', N'123456a', N'189c2bbf-9245-43c1-9030-18a59a2ae37c')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'83b5cd86-ba34-499c-bbdf-1d6cdd1877fb', N'Isabella Garcia', N'Female', N'0925678901', N'isabellagarcia@gmail.com', N'419 Riverbank Court, Ipswich, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'GalacticRover', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'b0815661-025d-4131-9b89-28fe3137a8ef', N'Charles Wright', N'Male', N'0979012345', N'charleswright@gmail.com', N'614 Riverside Drive, Cambridge, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'MidnightWanderer', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'3491baad-7edf-4672-ac0b-39c2dff0f896', N'Matthew Anderson', N'Male', N'0936789012', N'matthewanderson@gmail.com', N'520 Hillside Gardens, Plymouth, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'EchoSculptor', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'e642fa19-c7ef-4290-b25b-410d4233d82e', N'Aria Cooper', N'Female', N'0902345678', N'ariacooper@gmail.com', N'917 Meadow Lane, Reading, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'NeonTrailblazer', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'be7f91ff-ee0a-46d9-b0b5-415046e3de0e', N'Sophia Moore', N'Male', N'0980123456', N'sophiamoore@gmail.com', N'715 Hilltop Avenue, Oxford, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'SolarFlare', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'e1e445d7-cd39-4294-a1c5-60df032db316', N'Christopher Scott', N'Male', N'0991234567', N'christopherscott@gmail.com', N'816 Lakeview Place, Coventry, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'CosmicPanda', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'6920c834-b7db-4098-9568-650a4cc8b4e3', N'Emma Baker', N'Female', N'0968901234', N'emmabaker@gmail.com', N'513 Beachside Road, Brighton, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'SilverPhantom', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'b321965a-a64e-4f44-bd3a-6df0b87e07df', N'Mary Johnson', N'Female', N'0923456789', N'maryjohnson@gmail.com', N'456 Park Avenue, Manchester, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'StarSeeker', N'123456a', N'189c2bbf-9245-43c1-9030-18a59a2ae37c')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'ab291ffc-63f4-4da4-b7df-70d30f162ebe', N'Joseph Adams', N'Male', N'0957890123', N'josephadams@gmail.com', N'412 Strand Street, Southampton, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'MoonlightJester', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'2a84a803-ecd6-47c7-b2d2-7585d1d38b11', N'Daniel Robinson', N'Male', N'0914567890', N'danielrobinson@gmail.com', N'318 Mountain View, Luton, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'PixelVoyager', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'9dc673d7-9715-41f8-a9b0-75dc57a2710c', N'Grace Thompson', N'Male', N'0969012345', N'gracethompson@gmail.com', N'823 Meadowside Mews, Bristol, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'SonicInnovator', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'1f2f11c1-6e5a-4843-a959-776602be43ea', N'Olivia Miller', N'Female', N'0924567890', N'oliviamiller@gmail.com', N'909 Lochside Lane, Aberdeen, Scotland', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'QuantumPilot', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'dbc82711-a47a-4b98-a4d8-7c9127f8784c', N'William Hall', N'Male', N'0990123456', N'williamhall@gmail.com', N'606 Green Hill, Nottingham, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'HarmonyDreamer', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'2a76856b-85cf-4c3d-a173-969673884f31', N'Jessica Turner', N'Female', N'0989012345', N'jessicaturner@gmail.com', N'505 Thames Terrace, Sheffield, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'CyberPioneer', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'ee7dd801-5198-45d4-a00d-96a49bf62dce', N'Ava Wilson', N'Female', N'0947890123', N'avawilson@gmail.com', N'621 Seafront Crescent, Dover, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'ArcticStrider', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'227f2e2e-8baa-42f7-aa77-a16641364a9b', N'Michael Clark', N'Male', N'0978901234', N'michaelclark@gmail.com', N'404 Rose Gardens, Newcastle, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'AdventureGeek', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'97d741f4-7891-4dce-9fb9-a524e3180d2f', N'Robert Johnson', N'Male', N'0956789012', N'robertjohnson@gmail.com', N'202 Maple Street, Leeds, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'JazzMaster', N'123456a', N'189c2bbf-9245-43c1-9030-18a59a2ae37c')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'ba42523d-9119-4ceb-bc1a-a87f80a9b631', N'David Taylor', N'Male', N'0913456789', N'davidtaylor@gmail.com', N'808 Castle View, Edinburgh, Scotland', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'UrbanExplorer', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'71dc4920-0c85-40ff-b9bc-d01a9b8b671b', N'Sarah Martin', N'Female', N'0901234567', N'sarahmartin@gmail.com', N'707 Queen Square, Glasgow, Scotland', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'MysticScribe', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'ed0479d8-d912-4346-8e54-d51188524d70', N'John Smith', N'Male', N'0912345678', N'johnsmith@gmail.com', N'123 High Street, London, England', N'https://i.pinimg.com/236x/d5/6c/28/d56c28fa94fbbcf3260c46abe40dd567.jpg', 1, N'TechNinja', N'123456a', N'3497382f-72f2-4b58-9293-904709d02c54')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'9509a195-6356-4565-8913-d63b09f839d3', N'Emily White', N'Female', N'0967890123', N'emilywhite@gmail.com', N'303 Victoria Avenue, Bristol, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'QuantumCoder', N'123456a', N'189c2bbf-9245-43c1-9030-18a59a2ae37c')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'8d4353da-c884-4c5d-a3ae-ec6ac06398f0', N'Andrew Walker', N'Male', N'0958901234', N'andrewwalker@gmail.com', N'722 Parkside Lane, York, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'AuroraNavigator', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'0ecbf78f-71b1-4b20-b07a-f0641f7f41af', N'Ashley Lee', N'Male', N'0946789012', N'ashleylee@gmail.com', N'311 Valley View, Belfast, Northern Ireland', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'DigitalNomad', N'123456a', N'4b0f1b8f-c0cd-4b4e-a581-fc067c0823af')
INSERT [dbo].[User] ([id], [full_name], [gender], [phone], [email], [address], [image], [status], [user_name], [password], [role_id]) VALUES (N'63aa7c65-c696-4d03-aba2-f3c61f990236', N'James Brown', N'Male', N'0934567890', N'jamesbrown@gmail.com', N'789 Oak Lane, Liverpool, England', N'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, N'CoolUser', N'123456a', N'189c2bbf-9245-43c1-9030-18a59a2ae37c')
GO
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'bb4eb32e-b0af-4241-a4d8-0dc2eca07694', N'23f30915-0d91-4f3c-b9a8-002427fed3b7', 200000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'8bb8b09b-2a6f-4e4f-87b4-13cf2802a7d1', N'dbc82711-a47a-4b98-a4d8-7c9127f8784c', 100000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'6f32b3b8-8d0c-4cec-a788-40d6aaf3b6c9', N'be7f91ff-ee0a-46d9-b0b5-415046e3de0e', 50000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'45879be2-c5a2-4305-a5ff-5c635112281b', N'71dc4920-0c85-40ff-b9bc-d01a9b8b671b', 80000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'131136ca-af07-4088-8735-5fb95dd7cb9d', N'2a76856b-85cf-4c3d-a173-969673884f31', 100000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'23618e9e-bc95-48cd-a913-67339142d87f', N'83b5cd86-ba34-499c-bbdf-1d6cdd1877fb', 100000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'208e17d4-c45e-4357-8faa-6ac547997a82', N'3491baad-7edf-4672-ac0b-39c2dff0f896', 15000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'bf2c6bb2-9010-4711-a000-6c8ede6bd07f', N'b0815661-025d-4131-9b89-28fe3137a8ef', 50000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'985ea98a-bc4d-44d2-8002-6d343341c413', N'6920c834-b7db-4098-9568-650a4cc8b4e3', 10000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'b7dc47b0-150a-42ec-aedd-723b29186c52', N'9dc673d7-9715-41f8-a9b0-75dc57a2710c', 200000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'46160fe9-73a4-46ab-8a8f-74f51b20ec60', N'a01ad597-2e87-49be-b9db-006ee1e3fcd7', 250000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'4f4e7c83-f85f-4397-8446-77d2fc5786bc', N'97d741f4-7891-4dce-9fb9-a524e3180d2f', 50000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'30c16f83-2b89-4ec8-8ceb-7ad3f432b60f', N'ab291ffc-63f4-4da4-b7df-70d30f162ebe', 100000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'2dd255aa-0a89-41e9-9e6d-84d1b553a10a', N'63aa7c65-c696-4d03-aba2-f3c61f990236', 50000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'da3d4c4d-5c4e-4078-a91d-8630b486f347', N'227f2e2e-8baa-42f7-aa77-a16641364a9b', 50000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'426007fc-445c-4e59-96af-943e6e236a23', N'ee7dd801-5198-45d4-a00d-96a49bf62dce', 100000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'e0bd924e-e6ce-47cb-a761-9cb6e602b754', N'ba42523d-9119-4ceb-bc1a-a87f80a9b631', 300000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'72a5f38e-8054-4041-afd8-a018ad232502', N'9509a195-6356-4565-8913-d63b09f839d3', 100000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'0771b875-82dd-49ac-a474-bc3b09c9e2fc', N'e1e445d7-cd39-4294-a1c5-60df032db316', 1000000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'532e579a-4707-481a-b7f9-be3ec4ee69fc', N'0ecbf78f-71b1-4b20-b07a-f0641f7f41af', 100000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'a2f58048-1183-4fd9-be84-d1caefd23149', N'1f2f11c1-6e5a-4843-a959-776602be43ea', 60000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'eeeb27d2-3efc-46a9-92a8-d42589f5ca2e', N'2a84a803-ecd6-47c7-b2d2-7585d1d38b11', 100000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'5b834788-f819-4d98-a802-ee0d194b9ba6', N'e642fa19-c7ef-4290-b25b-410d4233d82e', 1000000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'42ee77ba-d270-4472-b385-f5dee2010b77', N'8d4353da-c884-4c5d-a3ae-ec6ac06398f0', 200000)
INSERT [dbo].[Wallet] ([id], [user_id], [balance]) VALUES (N'5410d99c-3a19-46a2-b6bb-fbdb018d9cc0', N'b321965a-a64e-4f44-bd3a-6df0b87e07df', 200000)
GO
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'48009d01-84d9-4db7-b1ce-1e7b01abce61', N'532e579a-4707-481a-b7f9-be3ec4ee69fc', 100000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'869321b6-7e48-41a1-a676-253b1bf8ccca', N'42ee77ba-d270-4472-b385-f5dee2010b77', 200000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'aeb4554e-e085-46bf-a402-359d4038fbec', N'5b834788-f819-4d98-a802-ee0d194b9ba6', 1000000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'25dc470d-81b3-4879-b195-379812a14733', N'131136ca-af07-4088-8735-5fb95dd7cb9d', 100000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'6b36b5e4-4d9c-460e-a252-452ed2294ed5', N'8bb8b09b-2a6f-4e4f-87b4-13cf2802a7d1', 100000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'30208d1a-5d0c-4a43-8f11-528830c63a1b', N'bb4eb32e-b0af-4241-a4d8-0dc2eca07694', 200000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'6e8e06dc-7527-479a-8908-5946d0e8a394', N'5410d99c-3a19-46a2-b6bb-fbdb018d9cc0', 200000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'9c7020a0-e23e-44b4-bd29-5f054b04aceb', N'426007fc-445c-4e59-96af-943e6e236a23', 100000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'b877324b-3d1e-4f81-a5e4-65f9db4c42de', N'2dd255aa-0a89-41e9-9e6d-84d1b553a10a', 50000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'554991bd-b151-4f3b-bc09-7391c615055e', N'a2f58048-1183-4fd9-be84-d1caefd23149', 60000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'73bbad12-ae64-4cea-aba5-73d9d2fe2992', N'da3d4c4d-5c4e-4078-a91d-8630b486f347', 50000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'caa1a8df-50e1-4a35-9cc0-7a63386dca50', N'0771b875-82dd-49ac-a474-bc3b09c9e2fc', 1000000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'cabeefbb-2787-4016-b76d-80a368d90e88', N'b7dc47b0-150a-42ec-aedd-723b29186c52', 200000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'98ffaaa3-b202-4d6e-99d7-814886050cb8', N'208e17d4-c45e-4357-8faa-6ac547997a82', 15000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'8fba3591-69e6-43fd-8072-83567cdc471b', N'bf2c6bb2-9010-4711-a000-6c8ede6bd07f', 50000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'9e95cadf-38a1-4af5-8e02-981c41faac69', N'23618e9e-bc95-48cd-a913-67339142d87f', 100000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'4855969a-cf46-4521-813a-a2dfa97be8ba', N'30c16f83-2b89-4ec8-8ceb-7ad3f432b60f', 100000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'fd0a117a-9d93-49a6-a98e-aeb839de5121', N'eeeb27d2-3efc-46a9-92a8-d42589f5ca2e', 100000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'0b962a8f-6b9a-4293-99d9-b837f9a0b577', N'985ea98a-bc4d-44d2-8002-6d343341c413', 10000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'262d254f-2705-428a-85ce-bbf0ffa97346', N'46160fe9-73a4-46ab-8a8f-74f51b20ec60', 250000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'96349942-bafe-4fed-8a70-bf7db27df870', N'e0bd924e-e6ce-47cb-a761-9cb6e602b754', 300000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'1ce4fa2e-38ff-44a7-ac2b-c5c67c20bb2c', N'6f32b3b8-8d0c-4cec-a788-40d6aaf3b6c9', 50000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'586ca6e9-710c-4119-bcd1-d4b592130c8b', N'4f4e7c83-f85f-4397-8446-77d2fc5786bc', 50000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'b1f342e9-e594-4397-98d1-e04630481595', N'45879be2-c5a2-4305-a5ff-5c635112281b', 80000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
INSERT [dbo].[Wallet_History] ([id], [wallet_id], [money_change], [history_time], [status]) VALUES (N'16aeb598-f48b-4f38-8cf5-e807f36bbf32', N'72a5f38e-8054-4041-afd8-a018ad232502', 100000, CAST(N'2024-02-26T18:00:00.000' AS DateTime), 1)
GO
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'0c1d0fca-268f-412a-9f1b-0dc46c190b0c', N'e1e445d7-cd39-4294-a1c5-60df032db316', 1000000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'1ba445d8-65d2-444a-8cf0-1a9ab978419b', N'b321965a-a64e-4f44-bd3a-6df0b87e07df', 200000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'7847d704-67fe-4bee-96fc-2244fe5080b4', N'ba42523d-9119-4ceb-bc1a-a87f80a9b631', 300000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'9409bb0c-99db-4d2a-bc09-2a9f492586fe', N'0ecbf78f-71b1-4b20-b07a-f0641f7f41af', 100000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'f14ec3d1-a02b-4274-a3a7-2f5af22a82e8', N'ab291ffc-63f4-4da4-b7df-70d30f162ebe', 100000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'78e6bd6c-976a-4aa2-a543-3b507525ebe6', N'63aa7c65-c696-4d03-aba2-f3c61f990236', 50000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'c4722f69-9e10-48c9-b657-4642ccd87c2f', N'8d4353da-c884-4c5d-a3ae-ec6ac06398f0', 200000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'b857b86d-53b5-4b11-8db8-4c717d9890a2', N'a01ad597-2e87-49be-b9db-006ee1e3fcd7', 250000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'a611cdaa-e423-4193-8995-4d065fde166c', N'227f2e2e-8baa-42f7-aa77-a16641364a9b', 50000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'74255418-151e-4afa-9774-6b8250f4def0', N'3491baad-7edf-4672-ac0b-39c2dff0f896', 15000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'9aebb7a3-b132-4a65-969c-79c456ad5c44', N'9509a195-6356-4565-8913-d63b09f839d3', 100000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'1efd2461-1b09-4eda-971e-7b4cf8046573', N'6920c834-b7db-4098-9568-650a4cc8b4e3', 10000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'edc794a9-a12e-4c41-8fe2-7b9e8efaea6d', N'23f30915-0d91-4f3c-b9a8-002427fed3b7', 200000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'aff5cf4c-ad76-424a-ab2a-86b1aeed6881', N'ee7dd801-5198-45d4-a00d-96a49bf62dce', 100000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'12be5a1d-3c47-411d-b629-8d2ea7057114', N'2a84a803-ecd6-47c7-b2d2-7585d1d38b11', 100000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'91135267-7c6c-4ba9-8b78-8dcfb06ef5ee', N'b0815661-025d-4131-9b89-28fe3137a8ef', 50000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'ec48e49a-fa88-4a23-a7ea-9ff2b3cede31', N'71dc4920-0c85-40ff-b9bc-d01a9b8b671b', 80000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'7d3ea124-3278-4b27-960d-a682e810d356', N'dbc82711-a47a-4b98-a4d8-7c9127f8784c', 100000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'bea77237-2171-4752-80d1-ac753959805b', N'1f2f11c1-6e5a-4843-a959-776602be43ea', 60000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'150303d5-e821-4741-aab8-b4a9cf16415c', N'e642fa19-c7ef-4290-b25b-410d4233d82e', 1000000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'6a3d2bda-4c4d-4bc5-b1f0-b631dc9b8374', N'2a76856b-85cf-4c3d-a173-969673884f31', 100000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'43779671-3ed3-4642-aad5-bb240ae3886b', N'83b5cd86-ba34-499c-bbdf-1d6cdd1877fb', 100000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'3ed9ef37-0610-4a7e-b31c-bc06babb796c', N'97d741f4-7891-4dce-9fb9-a524e3180d2f', 50000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'7b1728fc-4f41-4914-a4af-dc6ac2d087a7', N'be7f91ff-ee0a-46d9-b0b5-415046e3de0e', 50000, 1)
INSERT [dbo].[Wallet_Request] ([id], [user_id], [money_request], [status]) VALUES (N'2ce3b552-f6d8-48d7-9caf-e49627992378', N'9dc673d7-9715-41f8-a9b0-75dc57a2710c', 200000, 1)
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
