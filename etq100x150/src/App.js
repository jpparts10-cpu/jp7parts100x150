import React, { useState } from "react";

export default function EtiquetaZPL() {
  const [box, setBox] = useState("");
  const [importacao, setImportacao] = useState("JPP0023");
  const [skus, setSkus] = useState([
    { unidade: "", descricao: "", sku: "" },
    { unidade: "", descricao: "", sku: "" },
    { unidade: "", descricao: "", sku: "" },
    { unidade: "", descricao: "", sku: "" },
    { unidade: "", descricao: "", sku: "" },
    { unidade: "", descricao: "", sku: "" },
    { unidade: "", descricao: "", sku: "" },
    { unidade: "", descricao: "", sku: "" },
    { unidade: "", descricao: "", sku: "" },
    { unidade: "", descricao: "", sku: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...skus];
    updated[index][field] = value;
    setSkus(updated);
  };

  const gerarZPL = () => {
    let zpl = `^XA
^PW800
^LL1200
^CF0,60
^FO40,40^FDBox: ${box || ""}^FS
^FO500,40^FD${importacao || ""}^FS
^FO40,90^GB720,3,3^FS
`;

    const filledSkus = skus.filter((s) => s.sku.trim() !== "");

    if (filledSkus.length >= 1 && filledSkus.length <= 4) {
      // --- Layout vertical no topo, alinhado à esquerda, com retângulo GB ---
      const blocoAltura = 270; // espaçamento maior
      const inicioY = 120;

      filledSkus.forEach((item, i) => {
        const ypos = inicioY + i * blocoAltura;
        zpl += `
^FO160,${ypos}^GB520,235,3^FS
^CF0,45
^FO180,${ypos + 20}^FD${item.unidade || ""} un - ${item.descricao || ""}^FS
^BY3,2,120
^FO180,${ypos + 70}^BCN,120,Y,N,N
^FD${item.sku}^FS
`;
      });
    } else {
      // --- Layout em 2 colunas ---
      filledSkus.forEach((item, i) => {
        const col = i % 2; // 0 = esquerda, 1 = direita
        const row = Math.floor(i / 2);
        const x = 60 + col * 380;
        const ypos = 150 + row * 220;

        zpl += `
^CF0,30
^FO${x},${ypos}^FD${item.unidade || ""} un - ${item.descricao || ""}^FS
^BY2,2,80
^FO${x},${ypos + 40}^BCN,80,Y,N,N
^FD${item.sku}^FS
`;
      });
    }

    zpl += "^XZ";
    return zpl;
  };

  const zpl = gerarZPL();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Gerador de Etiqueta ZPL</h1>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div>
          <label>Box:</label>
          <input
            type="text"
            value={box}
            onChange={(e) => setBox(e.target.value)}
            style={{ marginLeft: 8, padding: 4 }}
          />
        </div>
        <div>
          <label>Importação:</label>
          <input
            type="text"
            value={importacao}
            onChange={(e) => setImportacao(e.target.value)}
            style={{ marginLeft: 8, padding: 4 }}
          />
        </div>
      </div>
      <table style={{ width: "100%", marginBottom: 16, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 4 }}>Unidade</th>
            <th style={{ textAlign: "left", padding: 4 }}>Descrição</th>
            <th style={{ textAlign: "left", padding: 4 }}>SKU</th>
          </tr>
        </thead>
        <tbody>
          {skus.map((item, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  value={item.unidade}
                  onChange={(e) => handleChange(idx, "unidade", e.target.value)}
                  style={{ width: "80px", padding: 4 }}
                  placeholder="Qtd"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={item.descricao}
                  onChange={(e) => handleChange(idx, "descricao", e.target.value)}
                  style={{ width: "180px", padding: 4 }}
                  placeholder="Descrição"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={item.sku}
                  onChange={(e) => handleChange(idx, "sku", e.target.value)}
                  style={{ width: "200px", padding: 4 }}
                  placeholder="SKU"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          navigator.clipboard.writeText(zpl);
          alert("ZPL copiado!");
        }}
        style={{ marginBottom: 16, padding: "8px 16px", cursor: "pointer" }}
      >
        Copiar ZPL
      </button>
      <h2>ZPL Gerado</h2>
      <pre
        style={{
          background: "#eee",
          padding: "16px",
          whiteSpace: "pre-wrap",
          fontSize: "13px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {zpl}
      </pre>
    </div>
  );
}