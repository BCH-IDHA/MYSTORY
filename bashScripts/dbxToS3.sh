#!/bin/bash

##############################################################################
#
#
# 1. Take a back up of S3 bucket
# 2. Fetch new stories from dropbox and save
# 3. Upload new stories to S3 bucket
#
# For configuring AWS on the machine:
# use aws configure to check local aws configuration
# after installing aws cli
# open terminal, and configure aws using following commands
# > $aws configure
# AWS Access Key ID [None]: --------------------
# AWS Secret Access Key [None]: -----------------
# Default region name [None]: us-east-1  
#
# Check aws configure
# > aws configure get aws_access_key_id
# > aws configure get aws_secret_access_key
#
#
##############################################################################



NOW=$(date +"%Y-%m-%d");

MY_STORY_DROPBOX_SERVICE_DIR=/Users/lakshmi/work/workspace/projects/MYSTORY/dropbox-to-s3-node/services/

DROPBOX_DIR__ROOT=/Users/lakshmi/work/workspace/projects/MYSTORY/download-history/dropbox/

TODAYS_DROPBOX_DIR_FOR_UPLOAD="$DROPBOX_DIR__ROOT$NOW/myhospitalstory.org/"

S3_BACKUP_DIR_ROOT=/Users/lakshmi/work/workspace/projects/MYSTORY/download-history/s3/

TODAYS_S3_BACKUP_DIR="$S3_BACKUP_DIR_ROOT$NOW/myhospitalstory.org/"

S3_BUCKET_NAME=myhospitalstory.org


echo ">>>>" $MY_STORY_DROPBOX_SERVICE_DIR
echo ">>>>" $DROPBOX_DIR__ROOT
echo ">>>>" $TODAYS_DROPBOX_DIR_FOR_UPLOAD
echo ">>>>" $S3_BACKUP_DIR_ROOT
echo ">>>>" $TODAYS_S3_BACKUP_DIR

#echo "1.==========Existing S3 backup : " $NOW
#aws s3 sync s3://$S3_BUCKET_NAME/  $TODAYS_S3_BACKUP_DIR

#echo "2.==========Downloading new MyStory on : " $NOW
#cd $MY_STORY_DROPBOX_SERVICE_DIR
#/usr/local/bin/node dropBoxToS3Service.js

#echo "3.==========Push to new MyStory S3 ============"
#aws s3 cp $TODAYS_DROPBOX_DIR_FOR_UPLOAD s3://$S3_BUCKET_NAME/ --recursive

#echo "4.==========Deleting todays download folders after uploading to S3============"
#echo $DROPBOX_DIR__ROOT$NOW
#rm -rf $DROPBOX_DIR__ROOT$NOW

echo "=============Done=================="


