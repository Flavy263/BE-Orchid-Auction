USE master;
GO

-- Now try to drop the database
DROP DATABASE OrchidAuction;

CREATE DATABASE OrchidAuction;
GO

USE OrchidAuction;
GO

CREATE TABLE [Role] (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    title NVARCHAR(255),
    description NVARCHAR(MAX)
);
GO

CREATE TABLE [User] (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    full_name NVARCHAR(255),
    gender NVARCHAR(10),
    phone NVARCHAR(20),
    email NVARCHAR(255),
    address NVARCHAR(255),
    image NVARCHAR(MAX),
    [status] bit,
    user_name NVARCHAR(50),
    [password] NVARCHAR(255),
	role_id UNIQUEIDENTIFIER,
	FOREIGN KEY (role_id) REFERENCES Role(id)
);
GO

CREATE TABLE Wallet (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    user_id UNIQUEIDENTIFIER,
    balance FLOAT,
    FOREIGN KEY (user_id) REFERENCES [User](id)
);
GO

CREATE TABLE Wallet_History (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    wallet_id UNIQUEIDENTIFIER,
	money_change FLOAT,
	history_time DATETIME,
	status BIT,
    FOREIGN KEY (wallet_id) REFERENCES Wallet(id)
);
GO

CREATE TABLE Wallet_Request (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    user_id UNIQUEIDENTIFIER,
    money_request FLOAT,
    [status] bit,
	FOREIGN KEY (user_id) REFERENCES [User](id)
);
GO

CREATE TABLE Product (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [name] NVARCHAR(255),
    [image] NVARCHAR(MAX),
    [video] NVARCHAR(MAX),
    [description] NVARCHAR(MAX),
    price FLOAT
);
GO

CREATE TABLE Auction (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    minimum_price_step FLOAT,
    start_time DATETIME,
    end_time DATETIME,
    registration_start_time DATETIME,
    registration_end_time DATETIME,
    [status] NVARCHAR(15),
    host_id UNIQUEIDENTIFIER,
    product_id UNIQUEIDENTIFIER,
    FOREIGN KEY (product_id) REFERENCES Product(id)
);
GO

CREATE TABLE [Order] (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    winner_id UNIQUEIDENTIFIER,
    auction_id UNIQUEIDENTIFIER,
    host_id UNIQUEIDENTIFIER,
    [status] bit,
    price FLOAT,
    [date] DATETIME,
	FOREIGN KEY (winner_id) REFERENCES [User](id),
	FOREIGN KEY (host_id) REFERENCES [User](id),
	FOREIGN KEY (auction_id) REFERENCES Auction(id)
);
GO

CREATE TABLE Auction_Bid (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    auction_id UNIQUEIDENTIFIER,
    customer_id UNIQUEIDENTIFIER,
    price FLOAT,
    create_time DATETIME,
	FOREIGN KEY (auction_id) REFERENCES Auction(id),
	FOREIGN KEY (customer_id) REFERENCES [User](id)
);
GO

-- Insert data for [Role] table
INSERT INTO [Role] (title, description) VALUES
('Admin', 'System Administrator'),
('Host', 'Auction Host'),
('Member', 'Auction Member');

-- Insert data for [User] table
INSERT INTO [User] (full_name, gender, phone, email, address, image, [status], user_name, [password], role_id) VALUES
('John Smith', 'Male', '0912345678', 'johnsmith@gmail.com', '123 High Street, London, England', 'https://i.pinimg.com/236x/d5/6c/28/d56c28fa94fbbcf3260c46abe40dd567.jpg', 1, 'TechNinja', '123456a', (SELECT id FROM [Role] WHERE title = 'Admin')),
('Mary Johnson', 'Female', '0923456789', 'maryjohnson@gmail.com', '456 Park Avenue, Manchester, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'StarSeeker', '123456a', (SELECT id FROM [Role] WHERE title = 'Host')),
('James Brown', 'Male', '0934567890', 'jamesbrown@gmail.com', '789 Oak Lane, Liverpool, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'CoolUser', '123456a', (SELECT id FROM [Role] WHERE title = 'Host')),
('Laura Davis', 'Female', '0945678901', 'lauradavis@gmail.com', '101 Elm Road, Birmingham, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'NatureLover', '123456a', (SELECT id FROM [Role] WHERE title = 'Host')),
('Robert Johnson', 'Male', '0956789012', 'robertjohnson@gmail.com', '202 Maple Street, Leeds, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'JazzMaster', '123456a', (SELECT id FROM [Role] WHERE title = 'Host')),
('Emily White', 'Female', '0967890123', 'emilywhite@gmail.com', '303 Victoria Avenue, Bristol, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'QuantumCoder', '123456a', (SELECT id FROM [Role] WHERE title = 'Host')),
('Michael Clark', 'Male', '0978901234', 'michaelclark@gmail.com', '404 Rose Gardens, Newcastle, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'AdventureGeek', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Jessica Turner', 'Female', '0989012345', 'jessicaturner@gmail.com', '505 Thames Terrace, Sheffield, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'CyberPioneer', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('William Hall', 'Male', '0990123456', 'williamhall@gmail.com', '606 Green Hill, Nottingham, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'HarmonyDreamer', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Sarah Martin', 'Female', '0901234567', 'sarahmartin@gmail.com', '707 Queen Square, Glasgow, Scotland', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'MysticScribe', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('David Taylor', 'Male', '0913456789', 'davidtaylor@gmail.com', '808 Castle View, Edinburgh, Scotland', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'UrbanExplorer', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Olivia Miller', 'Female', '0924567890', 'oliviamiller@gmail.com', '909 Lochside Lane, Aberdeen, Scotland', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'QuantumPilot', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Richard Martinez', 'Male', '0935678901', 'richardmartinez@gmail.com', '210 Highland Crescent, Cardiff, Wales', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'ZenHarbinger', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Ashley Lee', 'Male', '0946789012', 'ashleylee@gmail.com', '311 Valley View, Belfast, Northern Ireland', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'DigitalNomad', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Joseph Adams', 'Male', '0957890123', 'josephadams@gmail.com', '412 Strand Street, Southampton, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'MoonlightJester', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Emma Baker', 'Female', '0968901234', 'emmabaker@gmail.com', '513 Beachside Road, Brighton, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'SilverPhantom', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Charles Wright', 'Male', '0979012345', 'charleswright@gmail.com', '614 Riverside Drive, Cambridge, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'MidnightWanderer', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Sophia Moore', 'Male', '0980123456', 'sophiamoore@gmail.com', '715 Hilltop Avenue, Oxford, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'SolarFlare', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Christopher Scott', 'Male', '0991234567', 'christopherscott@gmail.com', '816 Lakeview Place, Coventry, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'CosmicPanda', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Aria Cooper', 'Female', '0902345678', 'ariacooper@gmail.com', '917 Meadow Lane, Reading, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'NeonTrailblazer', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Daniel Robinson', 'Male', '0914567890', 'danielrobinson@gmail.com', '318 Mountain View, Luton, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'PixelVoyager', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Isabella Garcia', 'Female', '0925678901', 'isabellagarcia@gmail.com', '419 Riverbank Court, Ipswich, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'GalacticRover', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Matthew Anderson', 'Male', '0936789012', 'matthewanderson@gmail.com', '520 Hillside Gardens, Plymouth, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'EchoSculptor', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Ava Wilson', 'Female', '0947890123', 'avawilson@gmail.com', '621 Seafront Crescent, Dover, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'ArcticStrider', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Andrew Walker', 'Male', '0958901234', 'andrewwalker@gmail.com', '722 Parkside Lane, York, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'AuroraNavigator', '123456a', (SELECT id FROM [Role] WHERE title = 'Member')),
('Grace Thompson', 'Male', '0969012345', 'gracethompson@gmail.com', '823 Meadowside Mews, Bristol, England', 'https://i.pinimg.com/236x/e6/37/2e/e6372e5dce13aedad9c0b0299dd8a34d.jpg', 1, 'SonicInnovator', '123456a', (SELECT id FROM [Role] WHERE title = 'Member'));

-- Insert data for Wallet table
INSERT INTO Wallet (user_id, balance) VALUES
((SELECT id FROM [User] WHERE user_name = 'NeonTrailblazer'), 1000000),
((SELECT id FROM [User] WHERE user_name = 'EchoSculptor'), 15000),
((SELECT id FROM [User] WHERE user_name = 'AuroraNavigator'), 200000),
((SELECT id FROM [User] WHERE user_name = 'MysticScribe'), 80000),
((SELECT id FROM [User] WHERE user_name = 'SonicInnovator'), 200000),
((SELECT id FROM [User] WHERE user_name = 'SolarFlare'), 50000),
((SELECT id FROM [User] WHERE user_name = 'AdventureGeek'), 50000),
((SELECT id FROM [User] WHERE user_name = 'CosmicPanda'), 1000000),
((SELECT id FROM [User] WHERE user_name = 'HarmonyDreamer'), 100000),
((SELECT id FROM [User] WHERE user_name = 'UrbanExplorer'), 300000),
((SELECT id FROM [User] WHERE user_name = 'SilverPhantom'), 10000),
((SELECT id FROM [User] WHERE user_name = 'MoonlightJester'), 100000),
((SELECT id FROM [User] WHERE user_name = 'JazzMaster'), 50000),
((SELECT id FROM [User] WHERE user_name = 'CoolUser'), 50000),
((SELECT id FROM [User] WHERE user_name = 'MidnightWanderer'), 50000),
((SELECT id FROM [User] WHERE user_name = 'StarSeeker'), 200000),
((SELECT id FROM [User] WHERE user_name = 'ArcticStrider'), 100000),
((SELECT id FROM [User] WHERE user_name = 'CyberPioneer'), 100000),
((SELECT id FROM [User] WHERE user_name = 'GalacticRover'), 100000),
((SELECT id FROM [User] WHERE user_name = 'PixelVoyager'), 100000),
((SELECT id FROM [User] WHERE user_name = 'ZenHarbinger'), 200000),
((SELECT id FROM [User] WHERE user_name = 'DigitalNomad'), 100000),
((SELECT id FROM [User] WHERE user_name = 'QuantumCoder'), 100000),
((SELECT id FROM [User] WHERE user_name = 'QuantumPilot'), 60000),
((SELECT id FROM [User] WHERE user_name = 'NatureLover'), 250000);

-- Insert data for Wallet_History table
INSERT INTO Wallet_History (wallet_id, money_change, history_time, status ) VALUES
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'CosmicPanda')), 1000000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'SilverPhantom')), 10000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'StarSeeker')), 200000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'EchoSculptor')), 15000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'GalacticRover')), 100000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'ArcticStrider')), 100000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'DigitalNomad')), 100000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'CoolUser')), 50000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'QuantumPilot')), 60000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'AuroraNavigator')), 200000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'MysticScribe')), 80000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'HarmonyDreamer')), 100000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'NatureLover')), 250000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'MidnightWanderer')), 50000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'MoonlightJester')), 100000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'PixelVoyager')), 100000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'SolarFlare')), 50000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'ZenHarbinger')), 200000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'CyberPioneer')), 100000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'JazzMaster')), 50000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'SonicInnovator')), 200000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'AdventureGeek')), 50000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'UrbanExplorer')), 300000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'NeonTrailblazer')), 1000000, '2024-02-26 18:00:00', 1),
((SELECT id FROM Wallet WHERE user_id = (SELECT id FROM [User] WHERE user_name = 'QuantumCoder')), 100000, '2024-02-26 18:00:00', 1);

-- Insert data for Wallet_Request table
INSERT INTO Wallet_Request (user_id, money_request, [status]) VALUES
((SELECT id FROM [User] WHERE user_name = 'CosmicPanda'), 1000000, 1),
((SELECT id FROM [User] WHERE user_name = 'SilverPhantom'), 10000, 1),
((SELECT id FROM [User] WHERE user_name = 'StarSeeker'), 200000, 1),
((SELECT id FROM [User] WHERE user_name = 'EchoSculptor'), 15000, 1),
((SELECT id FROM [User] WHERE user_name = 'GalacticRover'), 100000, 1),
((SELECT id FROM [User] WHERE user_name = 'ArcticStrider'), 100000, 1),
((SELECT id FROM [User] WHERE user_name = 'DigitalNomad'), 100000, 1),
((SELECT id FROM [User] WHERE user_name = 'CoolUser'), 50000, 1),
((SELECT id FROM [User] WHERE user_name = 'QuantumPilot'), 60000, 1),
((SELECT id FROM [User] WHERE user_name = 'AuroraNavigator'), 200000, 1),
((SELECT id FROM [User] WHERE user_name = 'MysticScribe'), 80000, 1),
((SELECT id FROM [User] WHERE user_name = 'HarmonyDreamer'), 100000, 1),
((SELECT id FROM [User] WHERE user_name = 'NatureLover'), 250000, 1),
((SELECT id FROM [User] WHERE user_name = 'MidnightWanderer'), 50000, 1),
((SELECT id FROM [User] WHERE user_name = 'MoonlightJester'), 100000, 1),
((SELECT id FROM [User] WHERE user_name = 'PixelVoyager'), 100000, 1),
((SELECT id FROM [User] WHERE user_name = 'SolarFlare'), 50000, 1),
((SELECT id FROM [User] WHERE user_name = 'ZenHarbinger'), 200000, 1),
((SELECT id FROM [User] WHERE user_name = 'CyberPioneer'), 100000, 1),
((SELECT id FROM [User] WHERE user_name = 'JazzMaster'), 50000, 1),
((SELECT id FROM [User] WHERE user_name = 'SonicInnovator'), 200000, 1),
((SELECT id FROM [User] WHERE user_name = 'AdventureGeek'), 50000, 1),
((SELECT id FROM [User] WHERE user_name = 'UrbanExplorer'), 300000, 1),
((SELECT id FROM [User] WHERE user_name = 'NeonTrailblazer'), 1000000, 1),
((SELECT id FROM [User] WHERE user_name = 'QuantumCoder'), 100000, 1);

-- Insert data for Product table
INSERT INTO Product ([name], [image], [video], [description], price) VALUES
('Phalaenopsis Sparkle Burst', 'https://cdn11.bigcommerce.com/s-pxrevx9n0f/images/stencil/1280x1280/products/1969/8079/P._Da_Shang_Sparkle_Fire1__14499.1585604433.jpg?c=2', 'orchid_video.mp4', 'Color: Pastel pink with miners. Design: Outstanding star-shaped petals. Scent: Intense, sweet scent.', 200000),
('Cymbidium Rainbow Splash', 'https://1001leaves.com/cdn/shop/products/4_e0bec01e-4b3e-4024-8751-20a648af3288.jpg?v=1673311478', 'orchid_video.mp4', 'Color: Various colors from red, orange, yellow to green. Design: Nose-shaped flower cluster with colorful colors. Scent: Delicate, pleasant scent.', 200000),
('Dendrobium Mystic Veil', 'https://i.etsystatic.com/28667733/r/il/50cbc2/3019080937/il_570xN.3019080937_gufi.jpg', 'orchid_video.mp4', 'Color: Pearl flower shell, creating a mysterious color effect. Design: Delicate small cluster of flowers. Scent: Gentle herbal scent.', 200000),
('Oncidium Galaxy Swirl', 'https://homegardeningph.files.wordpress.com/2015/07/equitant_oncidium_orchid_plant.jpg', 'orchid_video.mp4', 'Color: Bright colored circles on petals. Design: Strong flower branch curved like the universe. Scent: Fresh scent.', 200000),
('Vanda Mystic Mist', 'https://static.vecteezy.com/system/resources/thumbnails/001/622/022/original/vanda-orchid-flower-in-garden-at-winter-or-spring-day-video.jpg', 'orchid_video.mp4', 'Color: Dark purple with light haze. Design: Flowers are large and round. Scent: Intense, seductive scent.', 200000);

-- Insert data for Auction table
INSERT INTO Auction (minimum_price_step, start_time, end_time, registration_start_time, registration_end_time, [status], host_id, product_id) VALUES
(10000, '2024-01-05 08:00:00', '2024-01-05 10:00:00', '2024-01-02 00:00:00', '2024-01-04 00:00:00', 1, (SELECT id FROM [User] WHERE user_name = 'CoolUser'), (SELECT id FROM Product WHERE [name] = 'Phalaenopsis Sparkle Burst')),
(10000, '2024-01-10 14:00:00', '2024-03-10 10:00:00', '2024-01-07 00:00:00', '2024-01-09 00:00:00', 1, (SELECT id FROM [User] WHERE user_name = 'QuantumCoder'), (SELECT id FROM Product WHERE [name] = 'Oncidium Galaxy Swirl')),
(10000, '2024-03-15 14:00:00', '2024-03-15 10:00:00', '2024-01-12 00:00:00', '2024-01-14 00:00:00', 1, (SELECT id FROM [User] WHERE user_name = 'StarSeeker'), (SELECT id FROM Product WHERE [name] = 'Dendrobium Mystic Veil')),
(10000, '2024-03-20 14:00:00', '2024-03-20 10:00:00', '2024-01-17 00:00:00', '2024-01-19 00:00:00', 1, (SELECT id FROM [User] WHERE user_name = 'JazzMaster'), (SELECT id FROM Product WHERE [name] = 'Vanda Mystic Mist')),
(10000, '2024-03-25 14:00:00', '2024-03-25 10:00:00', '2024-01-22 00:00:00', '2024-01-24 00:00:00', 1, (SELECT id FROM [User] WHERE user_name = 'NatureLover'), (SELECT id FROM Product WHERE [name] = 'Cymbidium Rainbow Splash'));

-- Insert data for [Order] table
INSERT INTO [Order] (winner_id, auction_id, host_id, [status], price, [date]) VALUES
((SELECT id FROM [User] WHERE user_name = 'member'), (SELECT id FROM Auction WHERE start_time = '2024-03-01 12:00:00'), (SELECT id FROM [User] WHERE user_name = 'host'), 1, 60, '2024-03-15 18:30:00'),
((SELECT id FROM [User] WHERE user_name = 'member'), (SELECT id FROM Auction WHERE start_time = '2024-03-01 12:00:00'), (SELECT id FROM [User] WHERE user_name = 'host'), 1, 60, '2024-03-15 18:30:00'),
((SELECT id FROM [User] WHERE user_name = 'member'), (SELECT id FROM Auction WHERE start_time = '2024-03-01 12:00:00'), (SELECT id FROM [User] WHERE user_name = 'host'), 1, 60, '2024-03-15 18:30:00'),
((SELECT id FROM [User] WHERE user_name = 'member'), (SELECT id FROM Auction WHERE start_time = '2024-03-01 12:00:00'), (SELECT id FROM [User] WHERE user_name = 'host'), 1, 60, '2024-03-15 18:30:00'),
((SELECT id FROM [User] WHERE user_name = 'host'), (SELECT id FROM Auction WHERE start_time = '2024-03-05 14:00:00'), (SELECT id FROM [User] WHERE user_name = 'host'), 1, 45, '2024-03-20 20:30:00');

-- Insert data for Auction_Bid table
INSERT INTO Auction_Bid (auction_id, customer_id, price, create_time) VALUES
((SELECT id FROM Auction WHERE start_time = '2024-03-01 12:00:00'), (SELECT id FROM [User] WHERE user_name = 'member'), 50, '2024-03-15 18:15:00'),
((SELECT id FROM Auction WHERE start_time = '2024-03-05 14:00:00'), (SELECT id FROM [User] WHERE user_name = 'host'), 42, '2024-03-20 20:10:00');

