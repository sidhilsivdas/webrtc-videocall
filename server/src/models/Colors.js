const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Color extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            //Color.hasMany(models.product, {});
        }
    }

    Color.init(
        {
            id:{
                type:DataTypes.INTEGER,          
                autoIncrement:true,
                allowNull:false,
                primaryKey:true
            },
            color_name: DataTypes.STRING,
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
            modelName: 'color',
            underscored: true,
            paranoid: true,  
            deletedAt: 'deleted_at',
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    );
    //let result = await Category.sync({alter:true});
    return Color;
};