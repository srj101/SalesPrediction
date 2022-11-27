const arr_max = [
  11, 5, 5, 5, 16, 3, 14, 4, 6, 5, 0, 0, 6, 2, 5, 2, 3, 4, 6, 4, 2, 1, 2,
];
const inputMin = tf.tensor([102]);
const inputMax = tf.tensor([1230]);

async function initializeModle() {
  const model = await tf.loadLayersModel("model.json");
  return model;
}

console.log("hellow from mainjs");

// const prediction = model.predict();

function InputData(data) {
  inputTensor = tf.tensor(data);
  const normalizedInput = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
  return normalizedInput;
}

// const unNormPreds = preds
//       .mul(labelMax.sub(labelMin))
//       .add(labelMin);

function reverseNormalize(out, max, min = 0) {
  return out * (max - min) + min;
}

function OutPutArray(output, arr_max) {
  let res = [];
  let i = 0;
  for (keys in output) {
    const labelMax = tf.tensor([arr_max[i++]]);
    const labelMin = tf.tensor([0]);
    const preds = output[keys];
    // console.log(preds.dataSync()[0])
    const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin);
    predi = unNormPreds.dataSync()[0];
    res.push(predi);

    // console.log(i);
  }

  return res;
}

async function allRun(input) {
  const model = await initializeModle();
  const i = InputData(input);
  out = await model.predict(i);
  const res = OutPutArray(out, arr_max);
  return res;
}

const contentDiv = document.getElementById("content");
const dateVal = document.getElementById("dateVal");
const productVal = document.getElementById("product");
const products = [
  "",
  "Angbutter",
  "Plain Bread",
  "Jam",
  "Americano",
  "Croissant",
  "Caffee Latte",
  "Tiramisu Croissant",
  "Cacao Deep",
  "Pain AU Chocolate",
  "Almond Croissant",
  "Croque Monsieur",
  "Mad Garlic",
  "Milk Tea",
  "Pandoro",
  "Cheese Cake",
  "Lemon ADE",
  "Orange Pound",
  "Wiener",
  "Vanila Latte",
  "Berry ADE",
  "Tiramisu",
  "Merinque Cookie",
];

const predict = async () => {
  const input = dateVal.value;
  if (!input) {
    return;
  }
  let i =
    String(Number(input.split("-")[2])) + String(Number(input.split("-")[1]));
  i = Number(i);

  try {
    let res = await allRun(i);
    let points = [];

    res = res.map((x) => Math.abs(Math.pow(Math.E, x) + 2));
    // console.log(res);
    // console.log(productVal.value);
    if (productVal) {
      const baloh = Math.ceil(res[Number(productVal.value)]) + " units";
      contentDiv.innerText = "";
      contentDiv.innerText = baloh;
    }

    points = res.map((x, i) => {
      return { x: products[i], y: x };
    });

    // console.log(points);
    JSC.Chart("chartDiv", {
      type: "vertical column",
      series: [
        {
          points: points,
        },
      ],
    });

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
