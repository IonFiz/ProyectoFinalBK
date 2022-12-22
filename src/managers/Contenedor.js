const fs = require('fs');
const path =  require('path');

class Contenedor {

    constructor(filename){
        this.filename = path.join(__dirname,"..", `files/${filename}`);
    }

    async save(product){
        
        try{
            const products = await this.getAll();
            if(products.length>0){
                const lastId = products[products.length-1].id + 1;
                product.id = lastId;
                console.log(product.id);
                products.push(product);
                await fs.promises.writeFile(this.filename, JSON.stringify(products, null, 2));
            }else{
                product.id =  1;
                await fs.promises.writeFile(this.filename, JSON.stringify([product], null, 2));
            }
            

        } catch(err){
            console.log(err);
        }
    }

    async getById(id){
        try{
        const products = await this.getAll();

        let item = products.find( product => product.id === id );
        return item;

        } catch (err){
            console.log(err);
        }
        
    }

    async getAll(){

        try{
            const content = await fs.promises.readFile(this.filename, 'utf-8');
            if(content.length > 0){
                let array = JSON.parse(content);
                return array;
            }else{
                return [];
            }
            
        }
        catch(err){
            return "Cannot read file";
        }


    }

    async deleteById(id){
        try{
            const products = await this.getAll();
    
            const newProducts = products.filter(product => product.id !== id);
            console.log('Deleted product successfully');
    
            await fs.promises.writeFile(this.filename, JSON.stringify(newProducts, null, 2));
            } catch (err){
                return console.log(err);
            }
    }

    async deleteAll(){
        try{
            let content = await fs.promises.readFile(this.filename, 'utf-8');

            content = [];

            console.log("Deleted everything");

            await fs.promises.writeFile(this.filename, JSON.stringify(content, null, 2))
        }
        catch(err){
            console.log("Error", err);
        }
    }
    
    async getRandom(){
        const products = await this.getAll();
        let item = products[Math.floor(Math.random()*products.length)];
        return item;
    }
}

module.exports = Contenedor;