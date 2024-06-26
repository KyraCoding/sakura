/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         failed:
 *           type: boolean
 *           description: Whether the request failed or not (should be false) 
 *         id:
 *           type: integer
 *           description: The CTFtime id of the team
 *         name:
 *           type: string
 *           description: The name of the CTFtime team
 *         pfp:
 *           type: string
 *           description: The relative url address of the CTFtime team's profile picture
 *         country:
 *           type: string
 *           description: The nationality of the CTFtime team, abbreviated as a country code
 *         years:
 *           type: array
 *           description: An integer array of the years the CTFteam has participated in
 *         connections:
 *           type: array
 *           description: An object array of connections (websites, github, etc...) of the CTFtime team
 *           properties:
 *              connection:
 *                type: object
 *                description: An object containing information about a specific connection
 *                properties:
 *                  title:
 *                    type: string
 *                    description: The type of connection (website, twitter, etc...)
 *                  url:
 *                    type: string
 *                    description: The url of the connection
 *         current_members:
 *           type: array
 *           description: An object array of the current teammembers of the CTFtime team
 *           properties:
 *              member:
 *                type: object
 *                description: An object containing information about a specific member
 *                properties:
 *                  name:
 *                    type: string
 *                    description: The name of the team member
 *                  id:
 *                    type: integer
 *                    description: The CTFtime id of the team member
 *         former_members:
 *           type: array
 *           description: An object array of the former teammembers of the CTFtime team
 *           properties:
 *              member:
 *                type: object
 *                description: An object containing information about a specific member
 *                properties:
 *                  name:
 *                    type: string
 *                    description: The name of the team member
 *                  id:
 *                    type: integer
 *                    description: The CTFtime id of the team member
 *         <year>:
 *           type: object
 *           description: A object containing a year the CTFtime team has competed in. Note that there may be multiple <year> objects, for example there may be a 2024 object, a 2022 object and a 2021 object.
 *           properties:
 *             year:
 *               type: integer
 *               description: The year of the year object
 *             global_rank:
 *               type: integer
 *               description: The global rank of the CTFtime team in that year
 *             rating_points:
 *               type: double
 *               description: The rating points earned by the CTFtime team in that year
 *             country_rank:
 *               type: integer
 *               description: The country rank of the CTFtime team in that year
 *             competitions:
 *               type: array
 *               description: An object array of all the competitions the CTFtime team has done in that year
 *               properties: 
 *                 competition:
 *                   type: object
 *                   description: An object containing information about a specific competition
 *                   properties:
 *                     place:
 *                       type: integer
 *                       description: The final placement of the CTFtime team in that competition
 *                     event:
 *                       type: string
 *                       description: The name of the competition
 *                     ctf_points:
 *                       type: integer
 *                       description: The amount of points the CTFtime team earned in that competition. This is not rating points.
 *                     rating_points:
 *                       type: integer
 *                       description: The amount of rating points gained from that competition
 */
/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Get CTFtime team and returns information about them
 * /team/{id}:
 *   get:
 *     summary: Gets a CTFtime team by id and returns information about them
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The CTFtime team's id to look up
 *     responses:
 *       200:
 *         description: Returns a Team corresponding to the id provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       404:
 *         description: The team's id was not found
 *       500:
 *         description: Internal server error, likely CTFtime servers
 *
 */
