import Head from 'next/head'
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import styles from "../styles/Home.module.css";

export default function Home() {

  const [user, setUser] = useState({loggedIn: null})
  const [name, setName] = useState('')
  const [transactionStatus, setTransactionStatus] = useState(null) // NEW
  const [packsPage, setPacksPage] = useState(false);
  const [userFlovatars, setUserFlovatars] = useState([
    {
      "id": "6058",
      "name": "",
      "metadata": {
        "mint": "6058",
        "series": "1",
        "svg": "",
        "combination": "B38H288FxE252N448M429C87",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "mouth": "429",
          "clothing": "87",
          "nose": "448",
          "body": "38",
          "facialHair": "0",
          "eyes": "252",
          "hair": "288"
        },
        "rareCount": "0",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": "228",
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5563",
      "name": "",
      "metadata": {
        "mint": "5563",
        "series": "1",
        "svg": "",
        "combination": "B64H383F281E262N454M437C185",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "facialHair": "281",
          "hair": "383",
          "clothing": "185",
          "mouth": "437",
          "nose": "454",
          "body": "64",
          "eyes": "262"
        },
        "rareCount": "3",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5183",
      "name": "",
      "metadata": {
        "mint": "5183",
        "series": "1",
        "svg": "",
        "combination": "B35H290FxE254N456M424C114",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "hair": "290",
          "body": "35",
          "clothing": "114",
          "nose": "456",
          "facialHair": "0",
          "mouth": "424",
          "eyes": "254"
        },
        "rareCount": "2",
        "epicCount": "3",
        "legendaryCount": "1"
      },
      "accessoryId": "21",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5502",
      "name": "",
      "metadata": {
        "mint": "5502",
        "series": "1",
        "svg": "",
        "combination": "B71H295F281E263N448M436C190",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "facialHair": "281",
          "eyes": "263",
          "body": "71",
          "nose": "448",
          "hair": "295",
          "mouth": "436",
          "clothing": "190"
        },
        "rareCount": "3",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "6145",
      "name": "",
      "metadata": {
        "mint": "6145",
        "series": "1",
        "svg": "",
        "combination": "B71H301FxE266N448M437C149",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "facialHair": "0",
          "hair": "301",
          "body": "71",
          "mouth": "437",
          "nose": "448",
          "clothing": "149",
          "eyes": "266"
        },
        "rareCount": "1",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "3",
      "name": "",
      "metadata": {
        "mint": "3",
        "series": "1",
        "svg": "",
        "combination": "B50H289FxE266N454M437C136",
        "creatorAddress": "0x67b5ddcc022c6dc5",
        "components": {
          "eyes": "266",
          "nose": "454",
          "hair": "289",
          "mouth": "437",
          "clothing": "136",
          "facialHair": "0",
          "body": "50"
        },
        "rareCount": "0",
        "epicCount": "1",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": "581",
      "eyeglassesId": null,
      "backgroundId": "488",
      "bio": {}
    },
    {
      "id": "1745",
      "name": "",
      "metadata": {
        "mint": "1745",
        "series": "1",
        "svg": "",
        "combination": "B38H301F281E266N455M437C135",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "hair": "301",
          "mouth": "437",
          "clothing": "135",
          "eyes": "266",
          "body": "38",
          "facialHair": "281",
          "nose": "455"
        },
        "rareCount": "2",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5832",
      "name": "",
      "metadata": {
        "mint": "5832",
        "series": "1",
        "svg": "",
        "combination": "B50H379F285E258N455M437C175",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "eyes": "258",
          "clothing": "175",
          "nose": "455",
          "body": "50",
          "mouth": "437",
          "facialHair": "285",
          "hair": "379"
        },
        "rareCount": "1",
        "epicCount": "2",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "6071",
      "name": "",
      "metadata": {
        "mint": "6071",
        "series": "1",
        "svg": "",
        "combination": "B38H313F281E252N448M435C120",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "hair": "313",
          "eyes": "252",
          "clothing": "120",
          "nose": "448",
          "mouth": "435",
          "facialHair": "281",
          "body": "38"
        },
        "rareCount": "3",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "547",
      "hatId": "476",
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5119",
      "name": "",
      "metadata": {
        "mint": "5119",
        "series": "1",
        "svg": "",
        "combination": "B38H313FxE257N448M433C90",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "mouth": "433",
          "hair": "313",
          "body": "38",
          "nose": "448",
          "eyes": "257",
          "facialHair": "0",
          "clothing": "90"
        },
        "rareCount": "2",
        "epicCount": "1",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5634",
      "name": "",
      "metadata": {
        "mint": "5634",
        "series": "1",
        "svg": "",
        "combination": "B49H321FxE251N454M436C150",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "clothing": "150",
          "mouth": "436",
          "nose": "454",
          "eyes": "251",
          "facialHair": "0",
          "body": "49",
          "hair": "321"
        },
        "rareCount": "1",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": "220",
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5058",
      "name": "",
      "metadata": {
        "mint": "5058",
        "series": "1",
        "svg": "",
        "combination": "B39H327FxE258N454M425C173",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "mouth": "425",
          "hair": "327",
          "body": "39",
          "nose": "454",
          "eyes": "258",
          "facialHair": "0",
          "clothing": "173"
        },
        "rareCount": "1",
        "epicCount": "2",
        "legendaryCount": "0"
      },
      "accessoryId": "6",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5549",
      "name": "",
      "metadata": {
        "mint": "5549",
        "series": "1",
        "svg": "",
        "combination": "B52H320FxE251N454M436C192",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "mouth": "436",
          "eyes": "251",
          "hair": "320",
          "body": "52",
          "clothing": "192",
          "facialHair": "0",
          "nose": "454"
        },
        "rareCount": "0",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5440",
      "name": "",
      "metadata": {
        "mint": "5440",
        "series": "1",
        "svg": "",
        "combination": "B67H295FxE262N454M436C95",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "hair": "295",
          "mouth": "436",
          "clothing": "95",
          "eyes": "262",
          "body": "67",
          "facialHair": "0",
          "nose": "454"
        },
        "rareCount": "1",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5550",
      "name": "",
      "metadata": {
        "mint": "5550",
        "series": "1",
        "svg": "",
        "combination": "B46H306FxE251N454M436C149",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "mouth": "436",
          "eyes": "251",
          "hair": "306",
          "body": "46",
          "clothing": "149",
          "facialHair": "0",
          "nose": "454"
        },
        "rareCount": "0",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5490",
      "name": "",
      "metadata": {
        "mint": "5490",
        "series": "1",
        "svg": "",
        "combination": "B45H327FxE244N454M439C172",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "hair": "327",
          "mouth": "439",
          "eyes": "244",
          "clothing": "172",
          "body": "45",
          "facialHair": "0",
          "nose": "454"
        },
        "rareCount": "1",
        "epicCount": "3",
        "legendaryCount": "1"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": "233",
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5118",
      "name": "",
      "metadata": {
        "mint": "5118",
        "series": "1",
        "svg": "",
        "combination": "B38H289FxE258N448M429C90",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "nose": "448",
          "clothing": "90",
          "body": "38",
          "facialHair": "0",
          "mouth": "429",
          "eyes": "258",
          "hair": "289"
        },
        "rareCount": "1",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "510",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5604",
      "name": "",
      "metadata": {
        "mint": "5604",
        "series": "1",
        "svg": "",
        "combination": "B66H344FxE238N455M434C170",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "nose": "455",
          "mouth": "434",
          "facialHair": "0",
          "body": "66",
          "clothing": "170",
          "hair": "344",
          "eyes": "238"
        },
        "rareCount": "2",
        "epicCount": "1",
        "legendaryCount": "1"
      },
      "accessoryId": "26",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5838",
      "name": "",
      "metadata": {
        "mint": "5838",
        "series": "1",
        "svg": "",
        "combination": "B54H288FxE251N454M436C203",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "clothing": "203",
          "mouth": "436",
          "eyes": "251",
          "nose": "454",
          "body": "54",
          "facialHair": "0",
          "hair": "288"
        },
        "rareCount": "0",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "4587",
      "name": "",
      "metadata": {
        "mint": "4587",
        "series": "1",
        "svg": "",
        "combination": "B50H323FxE266N455M434C137",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "facialHair": "0",
          "mouth": "434",
          "hair": "323",
          "eyes": "266",
          "nose": "455",
          "clothing": "137",
          "body": "50"
        },
        "rareCount": "2",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "460",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "1747",
      "name": "",
      "metadata": {
        "mint": "1747",
        "series": "1",
        "svg": "",
        "combination": "B53H316FxE265N455M434C136",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "hair": "316",
          "facialHair": "0",
          "clothing": "136",
          "mouth": "434",
          "body": "53",
          "eyes": "265",
          "nose": "455"
        },
        "rareCount": "0",
        "epicCount": "2",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5576",
      "name": "",
      "metadata": {
        "mint": "5576",
        "series": "1",
        "svg": "",
        "combination": "B50H298FxE262N454M434C194",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "mouth": "434",
          "eyes": "262",
          "hair": "298",
          "body": "50",
          "clothing": "194",
          "facialHair": "0",
          "nose": "454"
        },
        "rareCount": "0",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "1",
      "name": "",
      "metadata": {
        "mint": "1",
        "series": "1",
        "svg": "",
        "combination": "B53H371FxE262N454M442C145",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "facialHair": "0",
          "body": "53",
          "mouth": "442",
          "clothing": "145",
          "hair": "371",
          "eyes": "262",
          "nose": "454"
        },
        "rareCount": "0",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "1640",
      "name": "",
      "metadata": {
        "mint": "1640",
        "series": "1",
        "svg": "",
        "combination": "B40H288FxE263N455M440C205",
        "creatorAddress": "0x5356af064621bb2a",
        "components": {
          "nose": "455",
          "clothing": "205",
          "mouth": "440",
          "body": "40",
          "hair": "288",
          "facialHair": "0",
          "eyes": "263"
        },
        "rareCount": "2",
        "epicCount": "1",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": "499",
      "bio": {}
    },
    {
      "id": "1525",
      "name": "",
      "metadata": {
        "mint": "1525",
        "series": "1",
        "svg": "",
        "combination": "B53H307FxE263N455M444C173",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "nose": "455",
          "clothing": "173",
          "mouth": "444",
          "body": "53",
          "hair": "307",
          "facialHair": "0",
          "eyes": "263"
        },
        "rareCount": "1",
        "epicCount": "1",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "6062",
      "name": "",
      "metadata": {
        "mint": "6062",
        "series": "1",
        "svg": "",
        "combination": "B50H324FxE251N454M436C161",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "eyes": "251",
          "mouth": "436",
          "body": "50",
          "clothing": "161",
          "hair": "324",
          "facialHair": "0",
          "nose": "454"
        },
        "rareCount": "2",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "768",
      "hatId": null,
      "eyeglassesId": "226",
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5057",
      "name": "",
      "metadata": {
        "mint": "5057",
        "series": "1",
        "svg": "",
        "combination": "B53H318FxE266N454M440C135",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "hair": "318",
          "mouth": "440",
          "clothing": "135",
          "eyes": "266",
          "body": "53",
          "facialHair": "0",
          "nose": "454"
        },
        "rareCount": "1",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "6097",
      "name": "",
      "metadata": {
        "mint": "6097",
        "series": "1",
        "svg": "",
        "combination": "B53H301FxE252N455M440C159",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "eyes": "252",
          "mouth": "440",
          "clothing": "159",
          "body": "53",
          "hair": "301",
          "facialHair": "0",
          "nose": "455"
        },
        "rareCount": "1",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "768",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "1291",
      "name": "",
      "metadata": {
        "mint": "1291",
        "series": "1",
        "svg": "",
        "combination": "B53H308F282E252N455M444C144",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "nose": "455",
          "clothing": "144",
          "body": "53",
          "facialHair": "282",
          "mouth": "444",
          "eyes": "252",
          "hair": "308"
        },
        "rareCount": "2",
        "epicCount": "1",
        "legendaryCount": "0"
      },
      "accessoryId": "536",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "6066",
      "name": "",
      "metadata": {
        "mint": "6066",
        "series": "1",
        "svg": "",
        "combination": "B34H330FxE238N454M425C121",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "body": "34",
          "eyes": "238",
          "hair": "330",
          "nose": "454",
          "facialHair": "0",
          "clothing": "121",
          "mouth": "425"
        },
        "rareCount": "1",
        "epicCount": "3",
        "legendaryCount": "1"
      },
      "accessoryId": "22",
      "hatId": "408",
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "4219",
      "name": "",
      "metadata": {
        "mint": "4219",
        "series": "1",
        "svg": "",
        "combination": "B53H318FxE266N454M434C170",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "hair": "318",
          "mouth": "434",
          "clothing": "170",
          "eyes": "266",
          "body": "53",
          "facialHair": "0",
          "nose": "454"
        },
        "rareCount": "1",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": "226",
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "1741",
      "name": "",
      "metadata": {
        "mint": "1741",
        "series": "1",
        "svg": "",
        "combination": "B53H368FxE265N448M430C134",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "nose": "448",
          "clothing": "134",
          "mouth": "430",
          "body": "53",
          "hair": "368",
          "facialHair": "0",
          "eyes": "265"
        },
        "rareCount": "1",
        "epicCount": "2",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "1750",
      "name": "",
      "metadata": {
        "mint": "1750",
        "series": "1",
        "svg": "",
        "combination": "B53H317FxE257N455M433C133",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "nose": "455",
          "clothing": "133",
          "mouth": "433",
          "body": "53",
          "hair": "317",
          "facialHair": "0",
          "eyes": "257"
        },
        "rareCount": "2",
        "epicCount": "1",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "4964",
      "name": "",
      "metadata": {
        "mint": "4964",
        "series": "1",
        "svg": "",
        "combination": "B58H303F284E261N454M436C205",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "mouth": "436",
          "hair": "303",
          "nose": "454",
          "clothing": "205",
          "body": "58",
          "facialHair": "284",
          "eyes": "261"
        },
        "rareCount": "3",
        "epicCount": "1",
        "legendaryCount": "0"
      },
      "accessoryId": null,
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "1614",
      "name": "",
      "metadata": {
        "mint": "1614",
        "series": "1",
        "svg": "",
        "combination": "B53H323F279E252N455M446C92",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "mouth": "446",
          "facialHair": "279",
          "eyes": "252",
          "nose": "455",
          "hair": "323",
          "body": "53",
          "clothing": "92"
        },
        "rareCount": "4",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "23",
      "hatId": "397",
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "3943",
      "name": "",
      "metadata": {
        "mint": "3943",
        "series": "1",
        "svg": "",
        "combination": "B38H323F276E258N450M440C173",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "nose": "450",
          "clothing": "173",
          "body": "38",
          "facialHair": "276",
          "mouth": "440",
          "eyes": "258",
          "hair": "323"
        },
        "rareCount": "2",
        "epicCount": "1",
        "legendaryCount": "0"
      },
      "accessoryId": "7",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "4589",
      "name": "",
      "metadata": {
        "mint": "4589",
        "series": "1",
        "svg": "",
        "combination": "B53H292FxE252N448M435C205",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "mouth": "435",
          "nose": "448",
          "hair": "292",
          "body": "53",
          "facialHair": "0",
          "eyes": "252",
          "clothing": "205"
        },
        "rareCount": "3",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "561",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "5429",
      "name": "",
      "metadata": {
        "mint": "5429",
        "series": "1",
        "svg": "",
        "combination": "B50H291F267E248N453M437C205",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "clothing": "205",
          "facialHair": "267",
          "body": "50",
          "hair": "291",
          "nose": "453",
          "eyes": "248",
          "mouth": "437"
        },
        "rareCount": "5",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "521",
      "hatId": "419",
      "eyeglassesId": null,
      "backgroundId": "568",
      "bio": {}
    },
    {
      "id": "5836",
      "name": "",
      "metadata": {
        "mint": "5836",
        "series": "1",
        "svg": "",
        "combination": "B50H307F281E263N448M437C90",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "eyes": "263",
          "clothing": "90",
          "nose": "448",
          "body": "50",
          "mouth": "437",
          "facialHair": "281",
          "hair": "307"
        },
        "rareCount": "3",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "531",
      "hatId": "582",
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "6061",
      "name": "",
      "metadata": {
        "mint": "6061",
        "series": "1",
        "svg": "",
        "combination": "B38H313FxE266N456M434C158",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "clothing": "158",
          "facialHair": "0",
          "eyes": "266",
          "hair": "313",
          "body": "38",
          "nose": "456",
          "mouth": "434"
        },
        "rareCount": "2",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "768",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": null,
      "bio": {}
    },
    {
      "id": "4963",
      "name": "",
      "metadata": {
        "mint": "4963",
        "series": "1",
        "svg": "",
        "combination": "B46H289FxE248N454M442C209",
        "creatorAddress": "0x2a0eccae942667be",
        "components": {
          "eyes": "248",
          "facialHair": "0",
          "nose": "454",
          "body": "46",
          "mouth": "442",
          "hair": "289",
          "clothing": "209"
        },
        "rareCount": "1",
        "epicCount": "0",
        "legendaryCount": "0"
      },
      "accessoryId": "520",
      "hatId": null,
      "eyeglassesId": null,
      "backgroundId": "572",
      "bio": {}
    }
  ]);

  const [nftsPerPack, setNftsPerPack] = useState(0);


  // const [userFlovatars, setUserFlovatars] = useState([]);

  const [chosenNfts, setChosenNfts] = useState([]);

  useEffect(() => fcl.currentUser.subscribe(setUser), [])


  const getFlovatars = async () => {
    const flovatars = await fcl.query({ 
      cadence: `
          import Flovatar from 0x9392a4a7c3f49a0b

          pub fun main(address:Address) : [Flovatar.FlovatarData] {
            return Flovatar.getFlovatars(address: address)
          }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)]
    });

    setUserFlovatars(flovatars);
    console.log({ flovatars });
}


  const AuthedState = () => {
    return (
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
        {/* <div>Address: {user?.addr ?? "No Address"}</div> */}
        <div onClick={getFlovatars} style={{backgroundColor: "white", color: "#1B5BD3", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Get Flovatars</div> {/* NEW */}
        <div onClick={fcl.unauthenticate} style={{backgroundColor: "white", color: "#1B5BD3", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Log Out</div>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
        <div onClick={fcl.logIn} style={{backgroundColor: "white", color: "#1B5BD3", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Connect Wallet</div>
        <div onClick={fcl.signUp} style={{backgroundColor: "white", color: "#1B5BD3", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Sign Up</div>
      </div>
    )
  }

  const FlovatarList = () => {
    return (
      <div style={{display: "flex", width: "100%", justifyContent: "center", alignContent: "center", paddingTop: "10px", flexDirection: "column"}}>

        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "30px"}}>
          <div style={{display: "flex", justifyContent: "left", alignItems: "center"}}>
            <p style={{fontSize: 30, fontFamily: "InterBold", paddingRight: "10px", margin: "0px"}}>My Flovatars</p>
            {chosenNfts.length == 0 ? <p style={{margin: "0px", padding: "0px"}}>(Select NFTs to Create Packs)</p>
             : <div onClick={() => {}} style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>
              Create Packs ({chosenNfts.length} Selected, 
              <input style={{width: "50px"}} type="number" name="someid" value={nftsPerPack} onChange={e => setNftsPerPack(e.target.value > chosenNfts.length ? chosenNfts.length : e.target.value)
             }/> per pack)</div>}
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width:"20%"}}>
            <div onClick={selectAllClickList} style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Select All</div>
            <div onClick={deselectAllClickList} style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>Deselect All</div>
          </div>
         
        </div>
        <div style={{gap: "20px", width: "100%", placeItems: "center", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr"}}>
          {userFlovatars.map((el, ind) => (
            <div key={el.id} style={{backgroundColor: chosenNfts.includes(el.id) ? "#90EE90" : "#ffffff", padding: "10px", width: "100%", display: "flex", borderRadius: "5%",
              justifyContent: "center", alignContent: "center", flexDirection: "column"}} className={styles.nftBlock} onClick={() => {
                updateClickList(el.id);
              }}>
              <img src={"https://flovatar.com/api/image/" + el.id} style={{backgroundColor: "#f8f8f8", width: "100%", borderRadius: "5%"}}></img>
              <p style={{width: "100%", display: "flex", 
            justifyContent: "right", alignContent: "center", paddingTop: "10px", paddingRight: "10px", fontFamily: "InterBold"}}>
              {el.metadata.rareCount}R {el.metadata.epicCount}E {el.metadata.legendaryCount}L
            </p>
            </div>
            
          ))}
          </div>
        </div>
    )
  }

  const PacksPage = () => {

  }

  const updateClickList = (id) => {
    const nftList = [...chosenNfts];
    if (nftList.includes(id)) {
      nftList.splice(chosenNfts.indexOf(id), 1);
    } else {
      nftList.push(id);
    }
    setChosenNfts(nftList);
    console.log(id);
  }

  const selectAllClickList = () => {
    const nftList = [];
    userFlovatars.forEach(element => {
      nftList.push(element.id);
    });
    setChosenNfts(nftList);
  }

  const deselectAllClickList = () => {
    setChosenNfts([]);
  }

  return (
    <div style={{backgroundColor: "white", color: "black", width: "100%"}} className={styles.main}>
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div style={{backgroundColor: "#1B5BD3", width:"100%", color: "white", display: "flex", justifyContent: "space-between",
            padding: "20px"}}>
        <div>
          <p style={{fontSize: 30, fontFamily: "InterBold", margin: "0px"}}>Storm NFT Pack Creator</p>
        </div>
        <div style={{width: "20%"}}>
          {user.loggedIn
            ? <AuthedState />
            : <UnauthenticatedState />
          }
        </div>
      </div>
      <div style={{display: "flex", width: "100%", justifyContent: "center", alignContent: "center", padding: "50px", flexDirection: "column"}}>

        <div style={{display: "flex", width: "100%"}}>
          <div style={{backgroundColor: "#1B5BD3", color: "white", padding: "5px", textAlign: "center"}} className={styles.hoverCss}>My Packs</div>
        </div>
        {(user.loggedIn && !packsPage) && <FlovatarList/>}
      </div>
    </div>
  )
}