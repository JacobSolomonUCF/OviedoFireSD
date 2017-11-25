package comtelekpsi.github.oviedofireandroid;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.AsyncTask;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatImageButton;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TableLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;

import org.w3c.dom.Text;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

public class VehicleSubActivity extends AppCompatActivity {

    private String vehicleId;
    private String vehicleName;
    private String uid;
    private String username;
    private String vSection;
    public static final String UID_SAVE = "UIDSaveFile";
    private String formId;
    private URL url;
    static Context context;
    private Activity activity;
    //ArrayList<RelativeLayout> buttons = new ArrayList();
    ArrayList<LinearLayout> buttons = new ArrayList();
    LinearLayout mLinearLayout;
    TextView tv1;
    Resources res;
    TableLayout mTableLayout;
    AppCompatImageButton refreshButton;
    ScrollView mScrollView;
    boolean isTablet;
    private Timer timer;
    private boolean timerFlag;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vehicle_sub);
        Log.e("HEREHERE","made it to sub");
        mTableLayout=(TableLayout) findViewById(R.id.subTableLayout);
        //mTableLayout.isStretchAllColumns();
        //mTableLayout.isShrinkAllColumns();
        context = this;
        activity=this;
        timerFlag=true;
        mScrollView=(ScrollView) findViewById(R.id.subScrollView);
        mLinearLayout = (LinearLayout) findViewById(R.id.subLinearLayout);
        res = getResources();
        isTablet=res.getBoolean(R.bool.isTablet);
        vehicleName= getIntent().getStringExtra("VEHICLE_NAME");
        Log.e("HEREHERE","VEHICLE_NAME retrieved: "+vehicleName);
        vehicleId = getIntent().getStringExtra("VEHICLE_ID");
        Log.e("HEREHERE","VEHICLE_ID retrieved: "+vehicleId);
        tv1=(TextView)findViewById(R.id.subTextView);
        tv1.setText(vehicleName+" sections:");
        if(isTablet)tv1.setTextSize(30);
        tv1.setTypeface(Typeface.DEFAULT_BOLD);
        TextView mUsernameTextView=(TextView) findViewById(R.id.subUsernameTextView);
        final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid = uidSave.getString("pUID", null);
        Log.e("HEREHERE","SubActive successfully retried uid: "+uid);
        username = uidSave.getString("pUsername", null);
        Log.e("HEREHERE","SubActive successfully retried username: "+username);
        mUsernameTextView.setText(username);
        mTableLayout.removeAllViews();
        refreshButton=(AppCompatImageButton) findViewById(R.id.subRefreshButton);
        refreshButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                new VehicleSubActivity.RetrieveJSON().execute();
            }
        });
        new VehicleSubActivity.RetrieveJSON().execute();
    }

    class RetrieveJSON extends AsyncTask<Void, Void, String> {
        private Exception exception;
        private ProgressDialog dialog = new ProgressDialog(VehicleSubActivity.this);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        protected String doInBackground(Void... urls) {
            // Do some validation here
            if (!isNetworkAvailable()){
                Toast.makeText(VehicleSubActivity.this, "No Internet Connection",
                        Toast.LENGTH_SHORT).show();
                return null;
            }
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/vehicleCompartments/?uid="+uid+"&vehicleId="+vehicleId);
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
            if(response == null) {
                response = "THERE WAS AN ERROR";
            }
            Log.i("INFO", response);
            if (dialog.isShowing()) {
                dialog.dismiss();
            }
            buttons.clear();
            buttons=SubJSONParser.subParse(response, mTableLayout, context, mLinearLayout, isTablet, res);
            for (int i=0; i<buttons.size(); i++){
                final int j=i;
                buttons.get(i).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        formId=buttons.get(j).getTag().toString();
                        TextView bLeft=(TextView) buttons.get(j).getChildAt(0);
                        vSection=bLeft.getText().toString();
                        new VehicleSubActivity.CompletionCheck().execute();
                    }
                });

            }
        }
    }

    class CompletionCheck extends AsyncTask <String, Void, String>{
        private ProgressDialog dialog = new ProgressDialog(context);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        @Override
        protected String doInBackground(String... params) {
            URL url;
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/checkCompletion/?uid="+uid+"&formId="+formId);
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
                timerFlag=false;
                Toast.makeText(VehicleSubActivity.this, "Form Already Completed: Loading completed form",
                        Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(context, ResultsActivity.class);
                intent.putExtra("FORM_ID", formId);
                startActivity(intent);
                //activity.finish();
            }
            else if (response.charAt(0)=='f'){
                System.out.println("read as false");
                timerFlag=false;
                Toast.makeText(VehicleSubActivity.this, "Loading form to complete",
                        Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(context, FormActivity.class);
                intent.putExtra("FORM_ID", formId);
                intent.putExtra("EDIT", false);
                startActivity(intent);
                //activity.finish();
            }
            else{
                System.out.println("hell if I know");
                timerFlag=false;
                Toast.makeText(VehicleSubActivity.this, "Form already opened by someone else",
                        Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(context, ResultsActivity.class);
                intent.putExtra("FORM_ID", formId);
                startActivity(intent);
            }
            Log.i("INFO", response);
            if (dialog.isShowing())
                dialog.dismiss();
        }
    }
    /*
    @Override
    protected void onResume(){
        super.onResume();
        mTableLayout.removeAllViews();
        new VehicleSubActivity.RetrieveJSON().execute();
    }
    */
    public boolean isNetworkAvailable() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();

        boolean isAvailable = false;
        if (networkInfo != null && networkInfo.isConnected()) {
            isAvailable = true;
        }
        return isAvailable;
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
            Intent i = new Intent(VehicleSubActivity.this, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            finish();
        }
    }
}
