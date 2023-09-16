const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.belongsTo(models.category, { foreignKey: 'category_id', targetKey: 'id' });
            // Product.beforeDestroy(async (product, options) => {
            //     await models.stock.destroy({where:{product_id:product.id}});                
            // });
        }
    }

    Product.init(
        {
            id:{
                type:DataTypes.INTEGER,          
                autoIncrement:true,
                allowNull:false,
                primaryKey:true
            },
            category_id:{
                type:DataTypes.INTEGER,          
                allowNull:false
            },
            product_name: DataTypes.STRING,
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
            modelName: 'product',
            underscored: true,
            paranoid: true,  
            deletedAt: 'deleted_at',
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    );
    //let result = await Category.sync({alter:true});
    return Product;
};