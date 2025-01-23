const { Router } = require( "express" );
const { handleWithdraw, handleDeposit, handleTransfer, handleGetStatements } = require( "../controllers/transectionControllers" );
const router = Router();

router.post( "/withdraw", handleWithdraw )
router.post( "/deposit", handleDeposit )
router.post( "/transfer", handleTransfer )
router.get( "/statements/:accountNumber", handleGetStatements )
module.exports = router;