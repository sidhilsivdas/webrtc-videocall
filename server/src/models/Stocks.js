const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Stock extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Stock.belongsTo(models.product, { foreignKey: 'product_id', targetKey: 'id' });
            Stock.belongsTo(models.color, { foreignKey: 'color_id', targetKey: 'id' });
        }
    }

    Stock.init(
        {
            id:{
                type:DataTypes.INTEGER,          
                autoIncrement:true,
                allowNull:false,
                primaryKey:true
            },
            product_id:{
                type:DataTypes.INTEGER,          
                allowNull:false
            },
            color_id:{
                type:DataTypes.INTEGER,          
                allowNull:false
            },
            //product_name: DataTypes.STRING,
            quantity: DataTypes.INTEGER,
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
            modelName: 'stock',
            underscored: true,
            paranoid: true,  
            deletedAt: 'deleted_at',
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    );
    //let result = await Category.sync({alter:true});
    return Stock;
};