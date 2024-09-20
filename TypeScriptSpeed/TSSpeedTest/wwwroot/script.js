var Json = "";
function BubbleSortClick() {
    var cisla = [
        294, 2242, 4728, 3619, 4678, 4178, 604, 1463, 3895, 4755, 3236, 4158, 3601, 4795, 883, 3459, 2501, 354, 1709, 3889, 4234, 4104, 4047, 877, 2334, 3753, 2148, 3704, 363, 732, 2380, 1689, 1515, 2717, 3424, 2110, 484, 3984, 2179, 2743, 3739, 1670, 3337, 608, 1996, 2321, 3984, 3097, 3886, 3009, 3624, 2084, 2680, 3981, 2766, 2806, 4125, 4901, 760, 4781, 2484, 3714, 1835, 4667, 1797, 2076, 4175, 2185, 1374, 3009, 4724, 521, 3069, 2202, 4344, 2217, 3422, 656, 4945, 929, 2927, 1761, 582, 4343, 2495, 3582, 3107, 1791, 3098, 2287, 1317, 1888, 2840, 3204, 4674, 2333, 3107, 224, 2196, 3907, 1257, 2784, 2797, 4424, 4414, 2613, 4207, 1390, 1787, 4919, 4416, 2596, 2723, 673, 1053, 3563, 1869, 396, 1487, 4435, 222, 1908, 4185, 3280, 1732, 2801, 2610, 4630, 449, 3584, 1099, 2829, 3941, 3333, 3769, 2407, 863, 1563, 4573, 3581, 977, 4695, 163, 3722, 1256, 4926, 235, 4554, 1949, 609, 1837, 817, 3651, 3445, 3093, 1475, 1166, 3501, 3956, 2931, 4727, 4722, 3116, 1906, 3994, 3949, 2015, 4965, 4300, 114, 3853, 900, 1744, 11, 1038, 4212, 3732, 2917, 4281, 2642, 3113, 4322, 1834, 3172, 4952, 2470, 3382, 1793, 3591, 3890, 371, 1930, 24, 2684, 3799, 1101, 3820, 1063, 554, 921, 482, 1607, 4104, 3782, 140, 999, 2506, 1139, 2234, 4832, 2584, 3793, 1607, 1181, 4298, 3037, 2414, 1441, 3750, 954, 4864, 2042, 3961, 2395, 4871, 1805, 2956, 1463, 4325, 1702, 1080, 2918, 4753, 3159, 3089, 3482, 1423, 1808, 1650, 856, 4152, 1830, 3923, 3215, 4645, 3997, 249, 3831, 1511, 4414, 1148, 891, 443, 758, 1092, 4290, 2599, 2740, 192, 1138, 978, 346, 2761, 4742, 2389, 3090, 965, 209, 4644, 5000, 2449, 4863, 1263, 356, 682, 3891, 3767, 2510, 1789, 3192, 1273, 2592, 2175, 1735, 217, 4538, 3915, 3888, 3326, 2196, 3908, 1980, 2985, 1220, 3146, 1786, 491, 3958, 4804, 1799, 618, 3556, 2637, 1502, 1886, 2170, 1191, 4504, 1480, 621, 4876, 2032, 1426, 2971, 1092, 2432, 3198, 1293, 1962, 2754, 916, 2133, 1802, 228, 3652, 2577, 1673, 3938, 2114, 4522, 4417, 1059, 762, 4918, 3713, 878, 1669, 1051, 3041, 94, 1898, 986, 4571, 2879, 3364, 2230, 855, 279, 3942, 3525, 1417, 3845, 116, 1438, 2617, 946, 795, 409, 4115, 3100, 4221, 974, 407, 4004, 3394, 3962, 2810, 1987, 1759, 1999, 4806, 772, 3401, 2175, 3526, 4893, 747, 1717, 2025, 4943, 2854, 4748, 141, 3510, 638, 1212, 3987, 554, 1737, 4243, 3128, 2343, 2449, 3555, 3007, 1751, 824, 4615, 4400, 4117
    ];
    var start = new Date().getTime();
    BubbleSort(cisla);
    var end = new Date().getTime();
    console.log(cisla.toString());
    console.log(end - start);
}
function BubbleSort(a) {
    for (var i = 1; i <= a.length - 1; ++i) {
        for (var j = 0; j < a.length - i; ++j) {
            if (a[j] > a[j + 1]) {
                var temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
        }
    }
}
function CaesarCipherClick() {
    var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a tortor nec odio euismod hendrerit. Proin viverra pharetra rutrum. Nunc metus metus, auctor a viverra id, eleifend non diam. Donec dictum lorem mi, a sodales risus efficitur nec. Integer euismod feugiat enim eu consectetur. Proin erat purus, elementum vel sem ac, interdum efficitur elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas elementum, ipsum nec efficitur aliquam, ante ipsum maximus velit, dictum aliquet elit leo fermentum dolor. Nam vel quam eget metus tristique imperdiet vel et risus. Aliquam mattis libero risus. Curabitur finibus justo vel dolor bibendum finibus. Vivamus at elit vel massa pharetra vulputate. Sed et tortor nec erat aliquet ultrices nec non dui. Quisque a mattis urna. Sed vitae convallis odio, ac eleifend nisl.Curabitur semper varius euismod. Donec a sodales metus. Nam malesuada dolor vel libero ultricies, eget vulputate mi consequat.Donec at ligula ac velit vehicula faucibus.Quisque condimentum tempus erat. Sed luctus a arcu ac eleifend. Fusce id arcu tortor. Aenean gravida lacus id felis tincidunt fermentum.Praesent eu blandit nisl. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.Nam ipsum felis, blandit sit amet fermentum lacinia, molestie non mi.Pellentesque laoreet tortor a justo mattis vehicula.Vestibulum non neque sit amet velit malesuada gravida in dictum est.Nam laoreet imperdiet felis non molestie. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus a ligula dolor. Vivamus porta, mi fringilla mattis sollicitudin, justo felis rutrum mi, sed sollicitudin dui leo vel eros.Duis quis arcu interdum, porttitor eros sed, viverra quam.Donec vulputate enim mi, dapibus placerat erat elementum in. Cras suscipit eleifend ligula, non fringilla tortor malesuada sed. Donec rhoncus, justo eleifend feugiat pellentesque, magna diam laoreet diam, vitae vulputate ante diam vel mi.Phasellus eget nunc lorem. Vestibulum id convallis leo, et dapibus arcu. Sed vel libero non massa fringilla blandit ac a metus. Etiam fermentum, ipsum vel aliquet placerat, turpis lacus varius lacus, sit amet ornare diam tortor aliquet velit. Nunc faucibus mi non luctus egestas. Ut ullamcorper ac metus facilisis efficitur. Sed porttitor quis ipsum ac rutrum.Vestibulum fringilla metus vitae bibendum suscipit. Vestibulum at lectus rhoncus, ultrices nisl et, porttitor nunc.Duis fermentum volutpat ultrices. Vestibulum at finibus libero. Integer dapibus ex in odio rhoncus, id placerat ligula eleifend.Mauris odio nisl, dapibus nec nisl quis, sollicitudin dignissim tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Nulla pellentesque nulla ut dictum lacinia. Nunc vel posuere velit.Quisque volutpat id nunc nec egestas. Donec vel enim massa. Aenean dapibus posuere mauris, in imperdiet ipsum laoreet nec. Suspendisse potenti. Quisque egestas sodales arcu, ac imperdiet neque rhoncus vitae. Vestibulum id neque mi. Suspendisse sapien purus, eleifend eget vulputate quis, maximus vel nunc. Curabitur nec rhoncus mi, et viverra eros. Nullam ut efficitur est, vel accumsan risus. Nullam dui est, aliquam id erat a, auctor mollis quam. Morbi ornare quis ante id auctor. Quisque faucibus pretium euismod. Aenean semper orci ac pretium vestibulum. Integer cursus, massa id lobortis gravida, nisl massa aliquet ligula, et sodales nunc eros vitae sapien.Mauris lobortis malesuada fringilla. Duis luctus mattis erat vitae molestie.";
    var start = new Date().getTime();
    var zprava = CaesarCipher(text);
    var end = new Date().getTime();
    console.log(zprava);
    console.log(end - start);
}
function CaesarCipher(text) {
    var zprava = "";
    for (var i = 0; i < text.length; i++) {
        var znak = text.charCodeAt(i);
        znak += 1;
        zprava += String.fromCharCode(znak);
    }
    return zprava;
}
function IsPrimeClick() {
    var num = parseInt(document.getElementById("strPrimeNumber").value);
    var start = new Date().getTime();
    var prime = IsPrime(num);
    var end = new Date().getTime();
    console.log(prime);
    console.log(end - start);
}
function IsPrime(number) {
    if (number <= 1)
        return false;
    if (number == 2)
        return true;
    if (number % 2 == 0)
        return false;
    var boundary = Math.floor(Math.sqrt(number));
    for (var i = 3; i <= boundary; i += 2) {
        if (number % i == 0)
            return false;
    }
    return true;
}
function SerializeClick() {
    var sklad = new Sklad("Sklad Nice", "Broumov");
    sklad.Polozky = [
        new Polozka("Telefon", "Samsung", 9999, "lorem ipsum dolor sit amet"),
        new Polozka("Mobil", "Gogen", 99959, "lorem ipsum dolor sit amet"),
        new Polozka("Televize", "Misc", 99919, "lorem ipsum dolor sit amet"),
        new Polozka("Sluchátka", "Kasper", 92999, "lorem ipsum dolor sit amet"),
        new Polozka("Hodinky", "Sims", 39999, "lorem ipsum dolor sit amet"),
        new Polozka("Křeslo", "Sins", 99699, "lorem ipsum dolor sit amet"),
        new Polozka("Pohovka", "Mob", 99799, "lorem ipsum dolor sit amet"),
        new Polozka("Míč", "Mose", 99599, "lorem ipsum dolor sit amet"),
        new Polozka("Auto", "Kali", 98999, "lorem ipsum dolor sit amet"),
        new Polozka("Kolo", "Lika", 99399, "lorem ipsum dolor sit amet"),
        new Polozka("Nákladní vůz", "Mins", 99929, "lorem ipsum dolor sit amet"),
        new Polozka("Topení", "Uks", 9991109, "lorem ipsum dolor sit amet"),
        new Polozka("Mikrofón", "GL", 99299, "lorem ipsum dolor sit amet"),
        new Polozka("Reproduktor", "Pear", 99599, "lorem ipsum dolor sit amet"),
        new Polozka("Tranzistor", "Mapple", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Chléb", "Bimbows", 99, "lorem ipsum dolor sit amet"),
        new Polozka("Čaj", "Gas", 99, "lorem ipsum dolor sit amet"),
        new Polozka("Sushi", "Mos", 99, "lorem ipsum dolor sit amet"),
        new Polozka("Sušenka", "Top", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Letadlo", "Sput", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Hračka", "Sput", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Helikoptéra", "Sput", 99949, "lorem ipsum dolor sit amet"),
        new Polozka("Telefon", "Samsung", 9999, "lorem ipsum dolor sit amet"),
        new Polozka("Mobil", "Gogen", 99959, "lorem ipsum dolor sit amet"),
        new Polozka("Televize", "Misc", 99919, "lorem ipsum dolor sit amet"),
        new Polozka("Sluchátka", "Kasper", 92999, "lorem ipsum dolor sit amet"),
        new Polozka("Hodinky", "Sims", 39999, "lorem ipsum dolor sit amet"),
        new Polozka("Křeslo", "Sins", 99699, "lorem ipsum dolor sit amet"),
        new Polozka("Pohovka", "Mob", 99799, "lorem ipsum dolor sit amet"),
        new Polozka("Míč", "Mose", 99599, "lorem ipsum dolor sit amet"),
        new Polozka("Auto", "Kali", 98999, "lorem ipsum dolor sit amet"),
        new Polozka("Kolo", "Lika", 99399, "lorem ipsum dolor sit amet"),
        new Polozka("Nákladní vůz", "Mins", 99929, "lorem ipsum dolor sit amet"),
        new Polozka("Topení", "Uks", 9991109, "lorem ipsum dolor sit amet"),
        new Polozka("Mikrofón", "GL", 99299, "lorem ipsum dolor sit amet"),
        new Polozka("Reproduktor", "Pear", 99599, "lorem ipsum dolor sit amet"),
        new Polozka("Tranzistor", "Mapple", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Chléb", "Bimbows", 99, "lorem ipsum dolor sit amet"),
        new Polozka("Čaj", "Gas", 99, "lorem ipsum dolor sit amet"),
        new Polozka("Sushi", "Mos", 99, "lorem ipsum dolor sit amet"),
        new Polozka("Sušenka", "Top", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Letadlo", "Sput", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Hračka", "Sput", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Helikoptéra", "Sput", 99949, "lorem ipsum dolor sit amet"),
        new Polozka("Telefon", "Samsung", 9999, "lorem ipsum dolor sit amet"),
        new Polozka("Mobil", "Gogen", 99959, "lorem ipsum dolor sit amet"),
        new Polozka("Televize", "Misc", 99919, "lorem ipsum dolor sit amet"),
        new Polozka("Sluchátka", "Kasper", 92999, "lorem ipsum dolor sit amet"),
        new Polozka("Hodinky", "Sims", 39999, "lorem ipsum dolor sit amet"),
        new Polozka("Křeslo", "Sins", 99699, "lorem ipsum dolor sit amet"),
        new Polozka("Pohovka", "Mob", 99799, "lorem ipsum dolor sit amet"),
        new Polozka("Míč", "Mose", 99599, "lorem ipsum dolor sit amet"),
        new Polozka("Auto", "Kali", 98999, "lorem ipsum dolor sit amet"),
        new Polozka("Kolo", "Lika", 99399, "lorem ipsum dolor sit amet"),
        new Polozka("Nákladní vůz", "Mins", 99929, "lorem ipsum dolor sit amet"),
        new Polozka("Topení", "Uks", 9991109, "lorem ipsum dolor sit amet"),
        new Polozka("Mikrofón", "GL", 99299, "lorem ipsum dolor sit amet"),
        new Polozka("Reproduktor", "Pear", 99599, "lorem ipsum dolor sit amet"),
        new Polozka("Tranzistor", "Mapple", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Chléb", "Bimbows", 99, "lorem ipsum dolor sit amet"),
        new Polozka("Čaj", "Gas", 99, "lorem ipsum dolor sit amet"),
        new Polozka("Sushi", "Mos", 99, "lorem ipsum dolor sit amet"),
        new Polozka("Sušenka", "Top", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Letadlo", "Sput", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Hračka", "Sput", 999, "lorem ipsum dolor sit amet"),
        new Polozka("Helikoptéra", "Sput", 99949, "lorem ipsum dolor sit amet"),
    ];
    var start = new Date().getTime();
    Json = JSON.stringify(sklad);
    var end = new Date().getTime();
    console.log(Json);
    console.log(end - start);
}
function Deserialize() {
    var start = new Date().getTime();
    var sklad = JSON.parse(Json);
    var end = new Date().getTime();
    console.log(sklad.Polozky.toString());
    console.log(end - start);
}
function Generate() {
    document.getElementById("container").innerHTML = "";
    var start = new Date().getTime();
    var elements = "";
    elements += '<table border="1">';
    for (var x = 1; x <= 50; x++) {
        elements += "<tr>";
        for (var y = 1; y <= 50; y++) {
            elements += "<td>" + x * y + "</td>";
        }
        elements += "</tr>";
    }
    elements += "</table>";
    document.getElementById("container").innerHTML = elements;
    var end = new Date().getTime();
    console.log(end - start);
}
var Sklad = /** @class */ (function () {
    function Sklad(nazev, misto) {
        this.Nazev = nazev;
        this.Misto = misto;
    }
    return Sklad;
}());
var Polozka = /** @class */ (function () {
    function Polozka(nazev, vyrobce, cena, popis) {
        this.Nazev = nazev;
        this.Vyrobce = vyrobce;
        this.Popis = popis;
        this.Cena = cena;
    }
    return Polozka;
}());
//# sourceMappingURL=script.js.map