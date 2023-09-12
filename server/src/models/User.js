const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    User.init(
        {
            
            full_name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            access_token: DataTypes.STRING,
            role:DataTypes.STRING,
            created_by: DataTypes.INTEGER
            
        },
        {
            sequelize,
            modelName: 'user',
            underscored: true,
        },
    );
    return User;
};