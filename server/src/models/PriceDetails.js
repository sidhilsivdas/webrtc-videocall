const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PriceDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            PriceDetails.belongsTo(models.stock, { foreignKey: 'stock_id', targetKey: 'id' });
        }
    }

    PriceDetails.init(
        {
            id:{
                type:DataTypes.BIGINT,          
                autoIncrement:true,
                allowNull:false,
                primaryKey:true
            },
            stock_id:{
                type:DataTypes.INTEGER,          
                allowNull:false
            },
            quantity_start: DataTypes.INTEGER,
            quantity_end: DataTypes.INTEGER,//
            price:DataTypes.DECIMAL(20,2),
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
            modelName: 'price_details',
            underscored: true,
            paranoid: true,  
            deletedAt: 'deleted_at',
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    );
    //let result = await Category.sync({alter:true});
    return PriceDetails;
};