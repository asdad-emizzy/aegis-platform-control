zip -r ./aegis-platform-control-clean.zip . \
  -x '*/.git/*' '.git/*' \
     '*/.*' '.*' \
     '*/node_modules/*' 'node_modules/*' \
     '*/dist/*' 'dist/*' \
     '*/build/*' 'build/*' \
     '*/.next/*' '.next/*' \
     '*/coverage/*' 'coverage/*' \
     '*/.turbo/*' '.turbo/*' \
     '*/.cache/*' '.cache/*' \
     '*/terraform/.terraform/*' \
     'terraform/.terraform/*' \
     '*/.terragrunt-cache/*' \
     '.terragrunt-cache/*'