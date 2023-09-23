const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class StockDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            StockDetails.belongsTo(models.stock, { foreignKey: 'stock_id', targetKey: 'id' });
            StockDetails.belongsTo(models.customer, { foreignKey: 'customer_id', targetKey: 'id' });
        }
    }

    StockDetails.init(
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
            customer_id:{
                type:DataTypes.INTEGER,          
                allowNull:true
            },
            description: DataTypes.STRING(500),
            type:DataTypes.STRING(10),
            quantity_in:DataTypes.INTEGER,
            quantity_before_update:DataTypes.INTEGER,
            quantity_after_update:DataTypes.INTEGER,
            stock_quantity: DataTypes.INTEGER,
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
            modelName: 'stock_details',
            underscored: true,
            paranoid: true,  
            deletedAt: 'deleted_at',
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    );
    //let result = await Category.sync({alter:true});
    return StockDetails;
};