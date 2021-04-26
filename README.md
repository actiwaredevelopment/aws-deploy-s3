## AWS Deploy S3 file for Github Actions

Deploy static files to AWS S3.

1. Read local files in the `source` folder
1. Delete remote s3 files in the `target` folder
1. Upload all local files to remote s3
1. Invalidate Cloudfront if `invalidation-id` exists

## Usage

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v1
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: <<YOUR_S3_REGION>>
- name: Deploy static files to AWS S3
  id: aws-deploy-s3
  uses: oneyedev/aws-deploy-s3@v1
  with:
    region: <<YOUR_S3_REGION>>
    bucket: <<YOUR_S3_BUCKET>>
    source: <<YOUR_LOCAL_SOURCE_FOLDER>>
    target: <<YOUR_REMOTE_TARGET_FOLDER>
    invalidation-id: <<YOUR_CLOUDFRONT_INVALIDATION_ID>>
```
