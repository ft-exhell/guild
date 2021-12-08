source .env

ganache-cli -m "$MNEMONIC" -f https://mainnet.infura.io/v3/$INFURA_API_KEY -q \ 
--unlock $USDC_WHALE \
--network 999