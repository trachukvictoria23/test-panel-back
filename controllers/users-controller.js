const User = require("../models/user")

const {
    handleError
} = require("../utils/serverMessages")

const getUsers = (async (req, res) => {
    // console.log('users params', req.query)
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    const search = req.query.search || ''
    const is_verified = req.query.is_verified
    const sorting = { [req.query.sort_field || 'createdAt']: +req.query.sort_direction || -1 }
    const startIndex = (page - 1) * per_page;
    const searchOptions = {}
    if (search)
        searchOptions.$or = [
            { full_name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ]
    if (is_verified) searchOptions.is_verified = is_verified

    const total = await User.countDocuments(searchOptions);

    User
        .find(searchOptions)
        .skip(startIndex)
        .limit(per_page)
        .sort(sorting)
        .then((data) =>
            res.status(200).json({
                total,
                data: data.map((user) => user.getUserInfo(user))
            }))
        .catch((error) => handleError(res, error))
})

const getUserById = ((req, res) => {
    User
        .findById(req.params.id)
        .then((user) => {
            if (!user) return handleError(res, 'User not found!')
            res.status(200).json(user.getUserInfo(user))
        })
        .catch((error) => handleError(res, error))
})

module.exports = {
    getUsers,
    getUserById
}