package comtelekpsi.github.oviedofireandroid;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.AsyncTask;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatButton;
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
import java.util.Timer;
import java.util.TimerTask;

import javax.net.ssl.HttpsURLConnection;

public class FormActivity extends AppCompatActivity implements DatePickerFragment.OnFragmentInteractionListener{

    LinearLayout mLinearLayout;
    TextView mCBTextView;
    TextView mTitleTextView;
    TextView mPrevCBTextView;
    TextView dateText;
    boolean edit;
    TableLayout mTableLayout;
    private String formId;
    private String offFormName;
    private String vehicleName;
    private String sectionName;
    private String uid;
    private String username;
    public static final String UID_SAVE = "UIDSaveFile";
    private URL url;
    private URL url4;
    Context context;
    Button submitButton;
    boolean isTablet;
    String jsonString;
    AsyncTask aTask;
    public Activity formActivity;
    private AppCompatButton[] buttons;
    private Timer timer;
    private boolean timerFlag;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_form);
        SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid = uidSave.getString("pUID", null);
        username = uidSave.getString("pUsername", null);
        context=this;
        timerFlag=true;
        Resources res = getResources();
        isTablet=res.getBoolean(R.bool.isTablet);
        vehicleName= getIntent().getStringExtra("VEHICLE_NAME");
        sectionName= getIntent().getStringExtra("VEHICLE_SECTION");
        formId = getIntent().getStringExtra("FORM_ID");
        edit = getIntent().getBooleanExtra("EDIT",false);
        offFormName = getIntent().getStringExtra("OFF_FORM_NAME");
        submitButton = (Button) findViewById(R.id.formSubmitButton);
        mTableLayout=(TableLayout) findViewById(R.id.formTableLayout);
        mCBTextView = (TextView) findViewById(R.id.formCompletedByTextView);
        mTitleTextView = (TextView) findViewById(R.id.formTitleTextView);
        mLinearLayout = (LinearLayout) findViewById(R.id.formLinearLayout);
        formActivity=this;
        TextView mUsernameTextView=(TextView) findViewById(R.id.formUsernameTextView);
        mUsernameTextView.setText(username);
        mCBTextView.setText("Being completed by: "+username);
        mPrevCBTextView=(TextView)findViewById(R.id.formPrevCBTextView);
        if(isTablet){
            mCBTextView.setTextSize(30);
            submitButton.setTextSize(30);
            mPrevCBTextView.setTextSize(30);
        }
        if (!edit) {
            System.out.println("YOTHISHAPPENED");
            aTask = new FormActivity.RetrieveJSON().execute();
        }
        else{
            aTask = new FormActivity.RetrieveCompletedJSON().execute();
        }
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which){
                            case DialogInterface.BUTTON_POSITIVE:
                                timerFlag=false;
                                aTask.cancel(true);
                                if (!edit)
                                    new FormActivity.CompletionCheck().execute();
                                else
                                    SubmitSheet();
                                break;
                            case DialogInterface.BUTTON_NEGATIVE:
                                //No button clicked
                                break;
                        }
                    }
                };
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setMessage("Are you sure you are ready to submit?").setPositiveButton("Yes", dialogClickListener)
                        .setNegativeButton("No", dialogClickListener);
                AlertDialog alert = builder.create();
                alert.show();
                TextView alertText = (TextView) alert.findViewById(android.R.id.message);
                if(isTablet)alertText.setTextSize(25);
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
                        timerFlag=false;
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
                .setNegativeButton("No", dialogClickListener);
        AlertDialog alert = builder.create();
        alert.show();
        TextView alertText = (TextView) alert.findViewById(android.R.id.message);
        if(isTablet)alertText.setTextSize(25);
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

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
            /*if (!isNetworkAvailable()){
                Toast.makeText(FormActivity.this, "No Internet Connection",
                        Toast.LENGTH_SHORT).show();
                return null;
            }*/
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
            FormJSONParser.formParse(response, mTitleTextView, mTableLayout, context, isTablet, mLinearLayout, false);
            ButtonGetter();
        }
    }

    class RetrieveCompletedJSON extends AsyncTask<Void, Void, String> {
        private ProgressDialog dialog = new ProgressDialog(FormActivity.this);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        @Override
        protected String doInBackground(Void... urls) {
            try {
                url4 = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/results/?uid="+uid+"&formId="+formId);
                HttpURLConnection urlConnection = (HttpURLConnection) url4.openConnection();
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
            EditFormJSONParser.formParse(response, mTitleTextView, mTableLayout, context, isTablet, mLinearLayout, true);
            ButtonGetter();
        }
    }

    public void SubmitSheet(){
        System.out.println("test777");
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
        System.out.println("test888");
        new FormActivity.SendJSON().execute();
        System.out.println(jsonString);
    }

    public JSONArray subSectionMethod(JSONObject jsonObjectOuter, TableLayout mTableLayout){
        JSONArray jsonSectionArray = new JSONArray();
        for (int i=0, j=mTableLayout.getChildCount(); i<j; i++){
            System.out.println("mTableLayout.getChildCount: "+j);
            System.out.println("run "+i);
            String sectionText;
            View sView = mTableLayout.getChildAt(i);
            JSONObject jsonObjectMiddle = new JSONObject();
            if (sView instanceof TableRow) {
                TableRow sRow = (TableRow) sView;
                TextView subSectionTextView = (TextView) sRow.getChildAt(0);
                sectionText = subSectionTextView.getText().toString();
                System.out.println("sectionText: "+sectionText);
                if (subSectionTextView.getHint()==null){
                    break;
                }
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
                    System.out.println("row type: "+rowType);
                    if (!rowType.equals("Text Row")&&!rowType.equals("Prev Row")) {
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
                                        LinearLayout linearLayout2 = null;
                                        if (mTableLayout.getChildAt(i+1).getTag().toString().compareTo("Text Row")==0) {
                                            System.out.println("at i+1");
                                            linearLayout2 = (LinearLayout) mTableLayout.getChildAt(i + 1);
                                        }
                                        else if (mTableLayout.getChildAt(i+2).getTag().toString().compareTo("Text Row")==0) {
                                            System.out.println("at i+2");
                                            linearLayout2 = (LinearLayout) mTableLayout.getChildAt(i + 2);
                                        }
                                        EditText repairEditText2 = (EditText) linearLayout2.getChildAt(1);
                                        if (!repairEditText2.getText().toString().isEmpty()&&repairEditText2.getText().toString()!=null) {
                                            repairString = repairEditText2.getText().toString();
                                            jsonObjectInner.put("note", repairString);
                                        }
                                        break;
                                    case "Repairs Needed":
                                        LinearLayout linearLayout = null;
                                        if (mTableLayout.getChildAt(i+1).getTag().toString().compareTo("Text Row")==0) {
                                            System.out.println("at i+1");
                                            linearLayout = (LinearLayout) mTableLayout.getChildAt(i + 1);
                                        }
                                        else if (mTableLayout.getChildAt(i+2).getTag().toString().compareTo("Text Row")==0) {
                                            System.out.println("at i+2");
                                            linearLayout = (LinearLayout) mTableLayout.getChildAt(i + 2);
                                        }
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
                            case "date":
                                TextView dateText = (TextView) row.getChildAt(1);
                                if (dateText.getText().toString().isEmpty()){
                                    Toast.makeText(context, "Please enter a date",
                                            Toast.LENGTH_LONG).show();
                                    JSONArray nullArray=null;
                                    return nullArray;
                                }
                                jsonObjectInner.put("result", dateText.getText().toString());
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
                                LinearLayout tempLayout=(LinearLayout) row.getChildAt(1);
                                FancySwitch fs = (FancySwitch) tempLayout.getChildAt(1);
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
                        System.out.println("test999");
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
                url2 = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/form/?uid="+uid+"&formId="+formId);
                //ToDO: doublecheck this is submitting right after changing below line to url2
                System.out.println("testBBB");
                if (!edit)
                    conn = (HttpURLConnection) url2.openConnection();
                else
                    conn=(HttpURLConnection)url2.openConnection();
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
                System.out.println("outputJSON: "+jsonString);
                System.out.println("responseCode: "+responseCode);
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
            formActivity.finish();
            //Intent intent = new Intent(FormActivity.this, MainMenuActivity.class);
            //startActivity(intent);

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
                System.out.println("test111");
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
            //System.out.println(response.charAt(1));
            if (edit) {
                System.out.println("test222");
                SubmitSheet();
            }
            else {
                if (response.charAt(0) == 't') {
                    timerFlag=false;
                    System.out.println("test333");
                    System.out.println("read as true");
                    Toast.makeText(FormActivity.this, "Somebody already completed this form; returning to previous page.",
                            Toast.LENGTH_SHORT).show();
                    formActivity.finish();
                } else if (response.charAt(0) == 'f') {
                    System.out.println("test444");
                    SubmitSheet();
                } else {
                    System.out.println("hell if I know");
                }
            }
            System.out.println("test666");
            Log.i("INFO", response);
            if (dialog.isShowing())
                dialog.dismiss();
        }
    }
    public boolean isNetworkAvailable() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();

        boolean isAvailable = false;
        if (networkInfo != null && networkInfo.isConnected()) {
            isAvailable = true;
        }
        return isAvailable;
    }

    public void ButtonGetter(){
        int rowCount=mTableLayout.getChildCount();
        if (mTableLayout.getTag()!=null) {
            buttons = new AppCompatButton[(int) mTableLayout.getTag()];
            System.out.println("buttons array size: " + buttons.length);
            for (int i = 0, j = 0; i < rowCount; i++) {
                TableRow childRow = (TableRow) mTableLayout.getChildAt(i);
                if (childRow.getTag().equals("date")) {
                    buttons[j] = (AppCompatButton) childRow.getChildAt(2);
                    dateText = (TextView) childRow.getChildAt(1);
                    final int dId = dateText.generateViewId();
                    dateText.setId(dId);
                    buttons[j].setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            System.out.println("dateText ID: " + dId);
                            submitButton.setTag(dId);
                            if ((int) submitButton.getTag() == dId)
                                System.out.println("Tag matches ID");
                            if (dateText.equals(findViewById(dId)))
                                System.out.println("View matches view");
                            showDatePickerDialog(v);
                        }
                    });
                    j++;
                }
            }
            System.out.println("buttons array size after: " + buttons.length);
        }
    }
    public void showDatePickerDialog(View v) {
        DialogFragment newFragment = new DatePickerFragment();
        newFragment.show(getSupportFragmentManager(), "datePicker");
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (timerFlag) {
            timer = new Timer();
            Log.i("Main", "Invoking logout timer");
            LogOutTimerTask logoutTimeTask = new LogOutTimerTask();
            timer.schedule(logoutTimeTask, 10800000); //auto logout in 180 minutes
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (timer != null) {
            timer.cancel();
            Log.i("Main", "cancel timer");
            timer = null;
        }
    }

    private class LogOutTimerTask extends TimerTask {

        @Override
        public void run() {

            //logout
            final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
            FirebaseAuth.getInstance().signOut();
            SharedPreferences.Editor editor = uidSave.edit();
            editor.clear();
            editor.commit();

            //redirect user to login screen
            Intent i = new Intent(FormActivity.this, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            finish();
        }
    }
}