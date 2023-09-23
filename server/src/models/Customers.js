const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
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

    Customer.init(
        {
            id:{
                type:DataTypes.INTEGER,          
                autoIncrement:true,
                allowNull:false,
                primaryKey:true
            },
            full_name: DataTypes.STRING,
            email: DataTypes.STRING,
            address: DataTypes.STRING(1000),
            phone: DataTypes.INTEGER,
            shop_name: DataTypes.STRING,
            created_by: DataTypes.INTEGER,
            created_at:{ 
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at:{ 
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal("current_timestamp"),
                //onUpdate: sequelize.literal("CURRENT_TIMESTAMP")
            }
            
        },
        {
            sequelize,
            modelName: 'customer',
            underscored: true,
            paranoid: true,  
            deletedAt: 'deleted_at',
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    );
    //await User.sync({alter:true});
    return Customer;
};