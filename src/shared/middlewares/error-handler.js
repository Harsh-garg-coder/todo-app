const errorHandler = (err, req, res, next) => {
    console.log(err);
    if (err.code === "23503") {   // 23503 = foreign_key_violation
        return res.status(400).json({ error: "Referenced resource does not exist" });
    }
    
    res.status(500).json({ error: "Internal server error" });
}

export default errorHandler;