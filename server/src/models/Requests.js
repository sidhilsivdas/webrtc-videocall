const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Request extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Request.belongsTo(models.customer, { foreignKey: 'customer_id', targetKey: 'id' });
           // RequestDetails.belongsTo(models.request, { foreignKey: 'request_id', targetKey: 'id' });
        }
    }

    Request.init(
        {
            id:{
                type:DataTypes.BIGINT,          
                autoIncrement:true,
                allowNull:false,
                primaryKey:true
            },
            customer_id:{
                type:DataTypes.INTEGER,          
                allowNull:false
            },
            created_by: DataTypes.INTEGER,
            created_at:{ 
                type: DataTypes.DATE,
                allowNull: false,
                //defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at:{ 
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                //onUpdate: sequelize.literal("CURRENT_TIMESTAMP")
            }
            
        },
        {
            sequelize,
            modelName: 'request',
            underscored: true,
            paranoid: true,  
            deletedAt: 'deleted_at',
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    );
    //let result = await Category.sync({alter:true});
    return Request;
};