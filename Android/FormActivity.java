package comtelekpsi.github.oviedofireandroid;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.AsyncTask;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RadioGroup;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

public class FormActivity extends AppCompatActivity {

    LinearLayout mLinearLayout;
    TextView mCBTextView;
    TextView mTitleTextView;
    TableLayout mTableLayout;
    private String formId;
    private String offFormName;
    private String vehicleName;
    private String sectionName;
    private String uid;
    private String username;
    public static final String UID_SAVE = "UIDSaveFile";
    private URL url;
    Context context;
    ArrayList<Equipment> eList;
    Button submitButton;
    String jsonString;
    AsyncTask aTask;
    public Activity formActivity;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_form);
        SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid = uidSave.getString("pUID", null);
        username = uidSave.getString("pUsername", null);
        context=this;
        vehicleName= getIntent().getStringExtra("VEHICLE_NAME");
        sectionName= getIntent().getStringExtra("VEHICLE_SECTION");
        formId = getIntent().getStringExtra("FORM_ID");
        offFormName = getIntent().getStringExtra("OFF_FORM_NAME");
        submitButton = (Button) findViewById(R.id.submit_button);
        mTableLayout=(TableLayout) findViewById(R.id.tableLayout2);
        mCBTextView = (TextView) findViewById(R.id.completedByTextView);
        mTitleTextView = (TextView) findViewById(R.id.formTitleTextView);
        mLinearLayout = (LinearLayout) findViewById(R.id.linearLayout);
        formActivity=this;
        TextView mUsernameTextView=(TextView) findViewById(R.id.usernameTextView);
        mUsernameTextView.setText(username);
        mCBTextView.setText("Being completed by: "+username);
        aTask= new FormActivity.RetrieveJSON().execute();

        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which){
                            case DialogInterface.BUTTON_POSITIVE:
                                aTask.cancel(true);
                                new FormActivity.CompletionCheck().execute();
                                break;
                            case DialogInterface.BUTTON_NEGATIVE:
                                //No button clicked
                                break;
                        }
                    }
                };
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setMessage("Are you sure you are ready to submit?").setPositiveButton("Yes", dialogClickListener)
                        .setNegativeButton("No", dialogClickListener).show();
            }
        });
    }

    @Override
    public void onBackPressed(){
        final Activity activity=formActivity;
        DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                switch (which){
                    case DialogInterface.BUTTON_POSITIVE:
                        //Yes button clicked
                        //logout of firebase
                        //return to login screen
                        activity.finish();
                        break;
                    case DialogInterface.BUTTON_NEGATIVE:
                        //No button clicked
                        break;
                }
            }
        };
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setMessage("Are you sure you want to leave the form without submitting it?").setPositiveButton("Yes", dialogClickListener)
                .setNegativeButton("No", dialogClickListener).show();
    }
   /* @Override
    public void onSaveInstanceState(Bundle savedInstanceState){
        super.onSaveInstanceState(savedInstanceState);
        savedInstanceState.put
    }*/

    class RetrieveJSON extends AsyncTask<Void, Void, String> {
        private ProgressDialog dialog = new ProgressDialog(FormActivity.this);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        protected String doInBackground(Void... urls) {
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/form/?uid="+uid+"&formId="+formId);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while ((line = bufferedReader.readLine()) != null) {
                        stringBuilder.append(line).append("\n");
                    }
                    bufferedReader.close();
                    System.out.println(stringBuilder.toString());
                    return stringBuilder.toString();
                }
                finally{
                    urlConnection.disconnect();
                }
            }
            catch(Exception e) {
                Log.e("ERROR", e.getMessage(), e);
                return null;
            }
        }
        protected void onPostExecute(String response) {
            if(response == null)
                response = "THERE WAS AN ERROR";
            Log.i("INFO", response);
            if (dialog.isShowing()) {
                dialog.dismiss();
            }
            FormJSONParser.formParse(response, mTitleTextView, mTableLayout, context);
        }
    }

    public void SubmitSheet(){
        JSONObject jsonObjectOuter = new JSONObject();
        JSONArray jsonArray = new JSONArray();
        try {
            jsonObjectOuter.put("uid", uid);
            jsonObjectOuter.put("formId", formId);
            View tempView=mTableLayout.getChildAt(0);
            if (tempView instanceof TableRow){
                TableRow tempRow = (TableRow) tempView;
                String tempRowType = tempRow.getTag().toString();
                if (tempRowType.equals("subSection")){
                    jsonArray=subSectionMethod(jsonObjectOuter, mTableLayout);
                    if (jsonArray==null)
                        return;
                    jsonObjectOuter.put("results", jsonArray);
                }
                else {
                    jsonArray=nonSubSectionMethod(0, mTableLayout.getChildCount(), mTableLayout);
                    if (jsonArray==null)
                        return;
                    jsonObjectOuter.put("results", jsonArray);
                }
            }
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        System.out.println(jsonObjectOuter);
        jsonString=jsonObjectOuter.toString();
        new FormActivity.SendJSON().execute();
        System.out.println(jsonString);
    }

    public JSONArray subSectionMethod(JSONObject jsonObjectOuter, TableLayout mTableLayout){
        JSONArray jsonSectionArray = new JSONArray();
        for (int i=0, j=mTableLayout.getChildCount(); i<j; i++){
            String sectionText;
            View sView = mTableLayout.getChildAt(i);
            JSONObject jsonObjectMiddle = new JSONObject();
            if (sView instanceof TableRow) {
                TableRow sRow = (TableRow) sView;
                TextView subSectionTextView = (TextView) sRow.getChildAt(0);
                sectionText = subSectionTextView.getText().toString();
                int inSectionCount=Integer.parseInt(subSectionTextView.getHint().toString());
                jsonObjectMiddle = new JSONObject();
                try {
                    jsonObjectMiddle.put("title", sectionText);
                    JSONArray innerArray= nonSubSectionMethod(i+1,inSectionCount,mTableLayout);
                    if (innerArray == null)
                        return innerArray;
                    jsonObjectMiddle.put("results", innerArray);
                    i+=inSectionCount;
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                jsonSectionArray.put(jsonObjectMiddle);
            }
        }
        return jsonSectionArray;
    }
    public JSONArray nonSubSectionMethod(int start, int rowCount, TableLayout mTableLayout){
        JSONArray jsonResultsArray = new JSONArray();
        try {
            for (int i = start, j = rowCount+start; i < j; i++) {
                View view = mTableLayout.getChildAt(i);
                String captionText;
                String repairString;
                JSONObject jsonObjectInner = new JSONObject();
                if (view instanceof TableRow) {
                    TableRow row = (TableRow) view;
                    String rowType = row.getTag().toString();
                    System.out.println(rowType);
                    if (!rowType.equals("Text Row")) {
                        TextView captionTextView = (TextView) row.getChildAt(0);
                        captionText = captionTextView.getText().toString();
                        jsonObjectInner.put("caption", captionText);
                        jsonObjectInner.put("type", rowType);
                        switch (rowType) {
                            case "RepairTextRow":
                                break;
                            case "pmr":
                                String radioState = captionTextView.getTag().toString();
                                switch (radioState) {
                                    case "Present":
                                        jsonObjectInner.put("result", "Present");
                                        break;
                                    case "Missing":
                                        jsonObjectInner.put("result", "Missing");
                                        break;
                                    case "Repairs Needed":
                                        LinearLayout linearLayout = (LinearLayout) mTableLayout.getChildAt(i + 1);
                                        EditText repairEditText = (EditText) linearLayout.getChildAt(1);
                                        repairString = repairEditText.getText().toString();
                                        if (repairString.isEmpty()){
                                            Toast.makeText(context, "Please enter details about repairs needed",
                                                    Toast.LENGTH_LONG).show();
                                            JSONArray nullArray=null;
                                            return nullArray;
                                        }
                                        jsonObjectInner.put("result", "Repairs Needed");
                                        jsonObjectInner.put("note", repairString);
                                        break;
                                    default:
                                        Toast.makeText(context, "Please select an option",
                                                Toast.LENGTH_LONG).show();
                                        JSONArray nullArray=null;
                                        return nullArray;
                                }
                                jsonResultsArray.put(jsonObjectInner);
                                break;
                            case "per":
                                TableRow pRow = (TableRow) mTableLayout.getChildAt(i + 1);
                                TextView perText = (TextView) pRow.getChildAt(1);
                                if (perText.getText().toString().isEmpty()){
                                    Toast.makeText(context, "Please select a value",
                                            Toast.LENGTH_LONG).show();
                                    JSONArray nullArray=null;
                                    return nullArray;
                                }
                                jsonObjectInner.put("result", perText.getText().toString());
                                jsonResultsArray.put(jsonObjectInner);
                                break;
                            case "num":
                                EditText numText = (EditText) row.getChildAt(1);
                                if (numText.getText().toString().isEmpty()){
                                    Toast.makeText(context, "Please enter a value",
                                            Toast.LENGTH_LONG).show();
                                    JSONArray nullArray=null;
                                    return nullArray;
                                }
                                jsonObjectInner.put("result", numText.getText().toString());
                                jsonResultsArray.put(jsonObjectInner);
                                break;
                            case "pf":
                                FancySwitch fs = (FancySwitch) row.getChildAt(2);
                                if (fs.isChecked())
                                    jsonObjectInner.put("result", "Passed");
                                else
                                    jsonObjectInner.put("result", "Failed");
                                jsonResultsArray.put(jsonObjectInner);
                                break;
                            default:
                                System.out.println("default case");
                                break;
                        }
                    }
                }
            }
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonResultsArray;
    }

    public class SendJSON extends AsyncTask<String, Void, String> {

        private ProgressDialog dialog = new ProgressDialog(FormActivity.this);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }

        @Override
        protected String doInBackground(String... params) {
            HttpURLConnection conn = null;
            URL url2 = null;
            try {
                url2 = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net");
                //ToDO: doublecheck this is submitting right after changing below line to url2
                conn = (HttpURLConnection) url.openConnection();
                conn.setReadTimeout(15000);
                conn.setConnectTimeout(15000);
                conn.setRequestMethod("POST");
                conn.setDoOutput(true);
                conn.setChunkedStreamingMode(0);
                conn.setRequestProperty("Content-Type", "application/json");
                OutputStream outputStream = new BufferedOutputStream(conn.getOutputStream());
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream, "utf-8"));
                writer.write(jsonString);
                writer.flush();
                writer.close();

                int responseCode=conn.getResponseCode();
                if (responseCode == HttpsURLConnection.HTTP_OK) {
                    BufferedReader in=new BufferedReader(
                            new InputStreamReader(
                                    conn.getInputStream()));
                    StringBuffer sb = new StringBuffer("");
                    String line="";
                    while((line = in.readLine()) != null) {
                        sb.append(line);
                        break;
                    }
                    in.close();
                    return sb.toString();
                }
                else {
                    return new String("false : "+responseCode);
                }
            }
            catch (MalformedURLException e) {
                e.printStackTrace();
            }
            catch(SocketTimeoutException e) {
                e.printStackTrace();
            }
            catch (IOException e) {
                e.printStackTrace();
            }
            finally {
                if(conn != null) // Make sure the connection is not null.
                    conn.disconnect();
            }
            return null;
        }
        @Override
        protected void onPostExecute(String result) {
            if (dialog.isShowing()) {
                dialog.dismiss();
            }
            Toast.makeText(getApplicationContext(), result,
                    Toast.LENGTH_LONG).show();
            Intent intent = new Intent(FormActivity.this, MainMenuActivity.class);
            startActivity(intent);
        }
    }

    class CompletionCheck extends AsyncTask<Void, Void, String> {
        private ProgressDialog dialog = new ProgressDialog(context);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        @Override
        protected String doInBackground(Void... params) {
            URL url3;
            try {
                url3 = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/checkCompletion/?uid="+uid+"&formId="+formId);
                HttpURLConnection urlConnection = (HttpURLConnection) url3.openConnection();
                try {
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while ((line = bufferedReader.readLine()) != null) {
                        stringBuilder.append(line).append("\n");
                    }
                    bufferedReader.close();
                    System.out.println(stringBuilder.toString());
                    return stringBuilder.toString();
                } finally {
                    urlConnection.disconnect();
                }
            }
            catch (Exception e){
                e.printStackTrace();
                return null;
            }
        }
        protected void onPostExecute(String response) {
            System.out.println(response.charAt(1));
            if(response.charAt(0)=='t'){
                System.out.println("read as true");
                Toast.makeText(FormActivity.this, "Somebody already completed this form; returning to previous page.",
                        Toast.LENGTH_SHORT).show();
                formActivity.finish();
            }
            else if (response.charAt(0)=='f'){
                SubmitSheet();
            }
            else{
                System.out.println("hell if I know");
            }
            Log.i("INFO", response);
            if (dialog.isShowing())
                dialog.dismiss();
        }
    }
}