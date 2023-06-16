module.exports = async function ({ minPrice, maxPrice, catalog }) {
  const answer = [];

  try {
    await handleCategory(catalog, { minPrice, maxPrice }, answer);

    answer.sort((a, b) => {
      if (a.price === b.price) {
        return a.name.localeCompare(b.name);
      }
      return a.price - b.price;
    });

    return answer;
  } catch (err) {
    console.log('Error occured while handling: ', err);
    return [];
  }
};

const checkIsActivePromisifier = async entity => {
  return new Promise((resolve, reject) => {
    entity.checkIsActive((error, isActive) => {
      if (error) {
        checkIsActivePromisifier(entity).then(resolve).catch(reject);
      } else {
        resolve(isActive);
      }
    });
  });
};

const getNamePromisifier = async entity => {
  return new Promise((resolve, reject) => {
    entity.getName((error, name) => {
      if (error) {
        getNamePromisifier(entity).then(resolve).catch(reject);
      } else {
        resolve(name);
      }
    });
  });
};

const getChildrenPromisifier = async category => {
  return new Promise((resolve, reject) => {
    category.getChildren((error, children) => {
      if (error) {
        getChildrenPromisifier(category).then(resolve).catch(reject);
      } else {
        resolve(children);
      }
    });
  });
};

const getPricePromisifier = async product => {
  return new Promise((resolve, reject) => {
    product.getPrice((error, price) => {
      if (error) {
        getPricePromisifier(product).then(resolve).catch(reject);
      } else {
        resolve(price);
      }
    });
  });
};

const handleProduct = async (product, prices, answer) => {
  const [isActive, price, name] = await Promise.all([
    checkIsActivePromisifier(product),
    getPricePromisifier(product),
    getNamePromisifier(product)
  ]);

  if (isActive && price >= prices.minPrice && price <= prices.maxPrice) {
    answer.push({ name, price });
  }
};

const handleCategory = async (category, prices, answer) => {
  const isActive = await checkIsActivePromisifier(category);
  if (!isActive) return;

  const children = await getChildrenPromisifier(category);
  await Promise.all(
    children.map(child => {
      if (child instanceof Category) {
        return handleCategory(child, prices, answer);
      }

      if (child instanceof Product) {
        return handleProduct(child, prices, answer);
      }
    })
  );
};
